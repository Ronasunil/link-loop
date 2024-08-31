import { Request, Response } from 'express';
import { imageParams, postAttrs, privacyEnum, reqWithPostProps } from '../interfaces/postInterfaces';
import { Helpers } from '@global/helpers/helpers';
import { postCache } from '@services/redis/postCache';
import { postSocketIo } from '@utils/features/sockets/postSocket';
import { PostWorker } from '@workers/postWorker';
import httpStatus from 'http-status-codes';
import { cloudinaryUploader } from '@global/helpers/cloudinary';
import { BadRequestError } from '@global/helpers/errorHandler';

interface reqWithPostImageProps extends Request {
  body: {
    content: string;
    bgColor: string;
    feelings: string;
    privacy: privacyEnum;
    gifUrl: string;
    profilePic: string;
    image: string;
  };
}

class Post {
  async create(req: reqWithPostProps, res: Response) {
    const postData = Post.prototype.getPostData(req.body, req);
    console.log(req.currentUser);
    postSocketIo.emit('add-post', postData);
    await postCache.addPost(postData);
    const postWorker = await new PostWorker().prepareQueueForCreation(postData);
    postWorker.addPost();
    res.status(httpStatus.OK).json({ message: 'Post created', post: postData });
  }

  async createWithImage(req: reqWithPostImageProps, res: Response) {
    const { image } = req.body;
    // uploading file to cloudinary
    const result = await cloudinaryUploader.imageUpload(image);
    if (!result?.public_id) throw new BadRequestError('File upload failed: Try again');

    // getting formatted data for saving to redis
    const postData = Post.prototype.getPostWithImgData(req.body, req, {
      imageId: result?.public_id!,
      imageVersion: result?.version.toString()!,
    });

    postSocketIo.emit('add-post', postData);
    await postCache.addPost(postData);
    const postWorker = await new PostWorker().prepareQueueForCreation(postData);
    postWorker.addPost();

    res.status(httpStatus.OK).json({ message: 'Post created', post: postData });
  }

  getPostWithImgData(data: reqWithPostImageProps['body'], req: Request, others: imageParams): postAttrs {
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
      image,
      imageId,
      imageVersion,
      _id,
      // @ts-ignore
      authId: req.currentUser?.authId,
      comments: [],
      createdAt: new Date(),
      // @ts-ignore
      email: req.currentUser?.email,
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

  getPostData(data: reqWithPostProps['body'], req: Request): postAttrs {
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
      // @ts-ignore
      authId: req!.currentUser?.authId,
      comments: [],
      createdAt: new Date(),
      // @ts-ignore
      email: req!.currentUser?.email,
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
