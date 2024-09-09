import { config } from '@utils/config';
import { imageDoc } from '@utils/features/image/interfaces/imageInterface';
import { imageModel } from '@utils/features/image/models/imageModel';
import { userModel } from '@utils/features/users/models/userModel';

export class ImageService {
  static async addProfileImage(
    userId: string,
    url: string,
    imageId: string,
    imageVersion: string,
    type: 'bg' | 'profile'
  ) {
    const image = ImageService.prototype.addImageDb(userId, imageId, imageVersion, type);
    const user = await userModel.findByIdAndUpdate(userId, { profileImg: url }, { new: true, runValidators: true });

    await Promise.all([image, user]);
  }

  static async addBgImageDb(
    userId: string,
    url: string,
    imageId: string,
    imageVersion: string,
    type: 'bg' | 'profile'
  ) {
    await ImageService.prototype.addImageDb(userId, imageId, imageVersion, type);
    await userModel.findByIdAndUpdate(userId, { bgImg: url });
  }

  private async addImageDb(
    userId: string,
    imageId: string,
    imageVersion: string,
    type: 'bg' | 'profile'
  ): Promise<void> {
    console.log('kl happened');
    await imageModel.create({
      userId,
      imageId: type === 'profile' ? imageId : '',
      imageVersion: type === 'profile' ? imageVersion : '',
      bgImageId: type === 'bg' ? imageId : '',
      bgImageVersion: type === 'bg' ? imageVersion : '',
      createdAt: new Date(),
    });
  }

  static async deleteBgImageDb(imageId: string, userId: string): Promise<void> {
    await Promise.all([
      imageModel.findOneAndDelete({ _id: imageId, userId }),
      userModel.findByIdAndUpdate(userId, { bgImg: '' }),
    ]);
  }

  static async deleteProfileImageDb(imageId: string, userId: string): Promise<void> {
    console.log('delete');
    console.log(await imageModel.findOne({ _id: imageId, userId }), userId);
    await Promise.all([
      imageModel.findOneAndDelete({ _id: imageId, userId }),
      userModel.findByIdAndUpdate(userId, { profileImg: config.DEFAULT_PROFILE_IMG }),
    ]);
  }

  static async getImage(imageId: string): Promise<imageDoc | null> {
    return await imageModel.findById(imageId);
  }

  static async getImages(userId: string): Promise<imageDoc[] | null> {
    console.log(userId);
    const images = await imageModel.find({ userId, imageId: { $ne: '' }, imageVersion: { $ne: '' } });

    return images;
  }

  static async getBgImages(userId: string): Promise<imageDoc[] | null> {
    console.log(userId);
    const images = await imageModel.find({ userId, bgImageId: { $ne: '' }, bgImageVersion: { $ne: '' } });

    return images;
  }
}
