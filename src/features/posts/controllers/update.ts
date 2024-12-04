import httpStatus from 'http-status-codes';
import { Response } from 'express';
import {
  postUpdationProps,
  postWithImageUpdationProps,
  reqWithPostUpdationProps,
} from '@post/interfaces/postInterfaces';
import { postCache } from '@services/redis/postCache';
import { PostWorker } from '@workers/postWorker';
import { postSocketIo } from '@utils/features/sockets/postSocket';
import { cloudinaryUploader } from '@global/helpers/cloudinary';
import { BadRequestError } from '@global/helpers/errorHandler';

class Update {
  async post(req: reqWithPostUpdationProps, res: Response) {
    const { postId } = req.params;

    const updatedData = await Update.prototype.getUpdatedData(req);

    const updatedPost = await postCache.updatePost(postId, updatedData);
    postSocketIo.emit('post updated', updatedPost);
    const postworker = await new PostWorker().prepareQueueForUpdation(updatedData);
    postworker.updatePost(postId);

    res.status(httpStatus.OK).json({ post: updatedPost });
  }

  private async getUpdatedData(req: reqWithPostUpdationProps): Promise<postWithImageUpdationProps> {
    const { imageId, imageVersion, image, video, videoVersion, videoId } = req.body;
    let data: postWithImageUpdationProps;
    data = req.body;

    if ((image && video) || (imageId && imageVersion && videoId && videoVersion)) {
      throw new BadRequestError('Image and video cannot be in the same post or something went wrong');
    }

    if (image && !video) {
      const result = await cloudinaryUploader.imageUpload(image);

      if (!result?.public_id) throw new BadRequestError('File upload failed: Try again');

      data = {
        ...req.body,
        imageId: result.public_id,
        imageVersion: result.version.toString(),
        videoId: '',
        videoVersion: '',
      };
    }

    // post updation which includes updation of video NOTE:(updating video should not have image)
    if (video && !image) {
      const result = await cloudinaryUploader.videoUpload(video);
      if (!result?.public_id) throw new BadRequestError('Video upload failed: Try again');

      data = {
        ...req.body,
        videoId: result.public_id,
        videoVersion: result.version.toString(),
        imageId: '',
        imageVersion: '',
      };
    }
    delete data.video;
    delete data.image;

    console.log(data, 'l');
    return data;
  }
}

export const update = new Update();
