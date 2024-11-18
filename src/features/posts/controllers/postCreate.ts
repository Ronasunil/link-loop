import { Request, Response } from 'express';
import {
  imageParams,
  postAttrs,
  privacyEnum,
  reqWithPostImageProps,
  reqWithPostProps,
  reqWithVideoPostProps,
} from '../interfaces/postInterfaces';
import { Helpers } from '@global/helpers/helpers';
import { postCache } from '@services/redis/postCache';
import { postSocketIo } from '@utils/features/sockets/postSocket';
import { PostWorker } from '@workers/postWorker';
import httpStatus from 'http-status-codes';
import { cloudinaryUploader } from '@global/helpers/cloudinary';
import { BadRequestError } from '@global/helpers/errorHandler';

class Post {
  async create(req: reqWithPostProps, res: Response) {
    const postData = Post.prototype.getPostData(req.body, req);

    postSocketIo.emit('add-post', postData);

    await postCache.addPost(postData);
    const postWorker = await new PostWorker().prepareQueueForCreation(postData);
    postWorker.addPost();
    res.status(httpStatus.OK).json({ message: 'Post created', post: postData });
  }

  async createWithImage(req: reqWithPostImageProps, res: Response) {
    const { image, gifUrl } = req.body;
    let postData: postAttrs;

    if (image && !gifUrl) {
      // uploading file to cloudinary
      const result = await cloudinaryUploader.imageUpload(image);
      if (!result?.public_id) throw new BadRequestError('File upload failed: Try again');

      // getting formatted data for saving to redis
      postData = Post.prototype.getPostWithImgData(req.body, req, {
        imageId: result?.public_id!,
        imageVersion: result?.version.toString()!,
      });
    } else {
      // getting formatted data for saving to redis
      postData = Post.prototype.getPostWithImgData(req.body, req, {
        imageId: '',
        imageVersion: '',
      });
    }

    postSocketIo.emit('add-post', postData);
    await postCache.addPost(postData);
    const postWorker = await new PostWorker().prepareQueueForCreation(postData);
    postWorker.addPost();

    res.status(httpStatus.OK).json({ message: 'Post created', post: postData });
  }

  async createWithVideo(req: reqWithVideoPostProps, res: Response) {
    const postData = await Post.prototype.getPostVideoData(req);

    postSocketIo.emit('add-post', postData);
    await postCache.addPost(postData);
    const postWorker = await new PostWorker().prepareQueueForCreation(postData);
    postWorker.addPost();

    res.status(httpStatus.OK).json({ message: 'Post created', post: postData });
  }

  private getPostWithImgData(data: reqWithPostImageProps['body'], req: Request, others: imageParams): postAttrs {
    const { content, bgColor, feelings, privacy, gifUrl, profilePic, image } = data;
    const { imageId, imageVersion } = others;
    const _id = Helpers.createObjectId();

    return {
      content,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      profilePic,
      userId: req.currentUser!._id,
      username: req.currentUser!.userName,
      imageId,
      videoId: '',
      videoVersion: '',
      imageVersion,
      _id,
      authId: req.currentUser!.authId,
      createdAt: new Date(),
      email: req.currentUser!.email,
      reactions: {
        like: 0,
        sad: 0,
        laugh: 0,
        wow: 0,
        angry: 0,
      },
      totalComments: 0,
      totalReaction: 0,
    };
  }

  private getPostData(data: reqWithPostProps['body'], req: Request): postAttrs {
    const { content, bgColor, feelings, privacy, gifUrl, profilePic } = data;
    const _id = Helpers.createObjectId();

    return {
      content,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      profilePic,
      _id,
      username: req.currentUser!.userName,
      userId: req.currentUser!._id,
      authId: req.currentUser!.authId,
      createdAt: new Date(),
      email: req.currentUser!.email,
      imageId: '',
      imageVersion: '',
      videoId: '',
      videoVersion: '',
      reactions: {
        like: 0,
        sad: 0,
        laugh: 0,
        wow: 0,
        angry: 0,
      },
      totalComments: 0,
      totalReaction: 0,
    };
  }

  private async getPostVideoData(req: reqWithVideoPostProps): Promise<postAttrs> {
    const { video, bgColor, feelings, privacy, gifUrl, profilePic } = req.body;
    const _id = Helpers.createObjectId();

    const result = await cloudinaryUploader.videoUpload(video);
    if (!result?.public_id) throw new BadRequestError('Video upload: failed');

    return {
      content: '',
      videoId: result.public_id,
      videoVersion: result.version.toString(),
      bgColor,
      feelings,
      privacy,
      username: req.currentUser!.userName,
      gifUrl,
      profilePic,
      _id,
      // @ts-ignore
      authId: req.currentUser!.authId,
      userId: req.currentUser!._id,
      createdAt: new Date(),
      // @ts-ignore
      email: req.currentUser!.email,
      imageId: '',
      imageVersion: '',
      reactions: {
        like: 0,
        sad: 0,
        laugh: 0,
        wow: 0,
        angry: 0,
      },
      totalComments: 0,
      totalReaction: 0,
    };
  }
}

export const post = new Post();
