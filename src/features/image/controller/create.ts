import { Response } from 'express';
import httpStatus from 'http-status-codes';
import { imageWorkerJob, reqForAddingImage } from '../interfaces/imageInterface';
import { cloudinaryUploader } from '@global/helpers/cloudinary';
import { BadRequestError } from '@global/helpers/errorHandler';
import { userCache } from '@services/redis/userCache';
import { config } from '@utils/config';
import { ImageWorker } from '@workers/imageWorker';
import { UploadApiResponse } from 'cloudinary';
import { imageSocket } from '@utils/features/sockets/imageSocket';

class Create {
  async profileImage(req: reqForAddingImage, res: Response) {
    const userId = req.currentUser!._id.toString();

    const { image } = req.body;

    const result = await cloudinaryUploader.imageUpload(image, userId.toString(), true, true);
    if (!result?.public_id) throw new BadRequestError('File upload failed: Try again');

    const profileImgUrl = `${config.CLOUDINARY_BASE_URL}v${result.version}/${result.public_id}`;

    const updatedUser = await userCache.updateUser(userId, {
      profileImg: profileImgUrl,
      imgId: result.public_id.toString(),
      imgVersion: result.version.toString(),
    });

    imageSocket.emit('update user', updatedUser);

    const imageWorker = await new ImageWorker().prepareQueueForProfile(
      Create.prototype.workerData(userId, profileImgUrl, 'profile', result)
    );
    imageWorker.addProfileImg();

    res.status(httpStatus.OK).json({ message: 'Profile picture added', user: updatedUser });
  }

  async bgImage(req: reqForAddingImage, res: Response) {
    const userId = req.currentUser!._id.toString();
    const { image } = req.body;

    const result = await cloudinaryUploader.imageUpload(image, userId, true, true);
    if (!result?.public_id) throw new BadRequestError('File upload failed: Try again');

    const bgImgUrl = `${config.CLOUDINARY_BASE_URL}v${result.version}/${result.public_id}`;

    const updatedUser = await userCache.updateUser(userId, {
      bgImg: bgImgUrl,
      bgImageId: result.public_id.toString(),
      imgVersion: result.version.toString(),
    });

    console.log(updatedUser);
    imageSocket.emit('update user', updatedUser);

    const imageWorker = await new ImageWorker().prepareQueueForBg(
      Create.prototype.workerData(userId, bgImgUrl, 'bg', result)
    );
    imageWorker.addBgImg();

    res.status(httpStatus.OK).json({ message: 'Background image added', user: updatedUser });
  }

  private workerData(userId: string, url: string, type: 'profile' | 'bg', result: UploadApiResponse): imageWorkerJob {
    const imageId = result.public_id.toString();
    const imageVersion = result.version.toString().replace(/v/g, '');

    return {
      userId,
      imageId,
      imageVersion,
      type,
      url,
    };
  }
}

export const create = new Create();
