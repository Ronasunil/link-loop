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

    const updateData = await Update.prototype.getUpdatedData(req);

    const updatedPost = await postCache.updatePost(postId, updateData);
    postSocketIo.emit('post-updated', updatedPost);
    new PostWorker().prepareQueueForUpdation(updateData).updatePost(postId);

    res.status(httpStatus.OK).json({ post: updatedPost });
  }

  private async getUpdatedData(req: reqWithPostUpdationProps): Promise<postWithImageUpdationProps> {
    const { bgColor, content, feelings, gifUrl, privacy, profilePic, imageId, imageVersion, image } = req.body;
    let data: postWithImageUpdationProps;
    // post updation that already has image
    if (imageId && imageVersion)
      data = { bgColor, content, feelings, gifUrl, privacy, profilePic, imageId, imageVersion };

    // post updation which includes updation of image
    if (image) {
      const result = await cloudinaryUploader.imageUpload(image);

      if (!result?.public_id) throw new BadRequestError('File upload failed: Try again');

      data = {
        bgColor,
        content,
        feelings,
        gifUrl,
        privacy,
        profilePic,
        imageId: result.public_id,
        imageVersion: result.version.toString(),
      };
    }

    // @ts-ignore
    return data;
  }
}

export const update = new Update();
