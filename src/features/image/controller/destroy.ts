import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { userCache } from '@services/redis/userCache';
import { config } from '@utils/config';
import { imageSocket } from '@utils/features/sockets/imageSocket';
import { ImageWorker } from '@workers/imageWorker';

class Destroy {
  async ProfileImg(req: Request, res: Response) {
    const userId = req.currentUser!._id.toString();
    console.log(req.currentUser?._id, 'authid');
    const { imageId } = req.params as { imageId: string };

    const updateduser = await userCache.updateUser(userId, {
      profileImg: config.DEFAULT_PROFILE_IMG,
      imgId: '',
      imgVersion: '',
    });
    imageSocket.emit('updated user', updateduser);

    const imageWorker = await new ImageWorker().prepareQueueForProfileDeletion({ imageId, userId });
    imageWorker.deleteProfileImg();

    res.status(httpStatus.NO_CONTENT).json({ message: 'Deleted profile image' });
  }

  async bgImg(req: Request, res: Response) {
    const userId = req.currentUser!._id.toString();
    const { imageId } = req.params as { imageId: string };

    const updateduser = await userCache.updateUser(userId, { bgImg: '', bgImageId: '', bgImageVersion: '' });
    imageSocket.emit('updated user', updateduser);

    const imageWorker = await new ImageWorker().prepareQueueForBgDeletion({ imageId, userId });
    imageWorker.delteBgImg();

    res.status(httpStatus.NO_CONTENT).json({ message: 'Deleted background image' });
  }
}

export const destroy = new Destroy();
