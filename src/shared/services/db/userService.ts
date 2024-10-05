import { NotFoundError } from '@global/helpers/errorHandler';
import {
  redisUserAttrs,
  userDoc,
  userSettingsUpdationProp,
  userUpdationBasicinfo,
  userUpdationSocialLink,
} from '@utils/features/users/interface/user.interface';
import { userModel } from '@utils/features/users/models/userModel';
import { PostService } from './postService';
import { postDoc } from '@post/interfaces/postInterfaces';
import { FollowerService } from './followerService';
import { Helpers } from '@global/helpers/helpers';
import { authModel } from '@utils/features/auth/models/authModel';

export class UserService {
  static async getAllUsers(excludeId: string, skip: number, limit: number): Promise<userDoc[]> {
    const users = await userModel
      .find({ _id: { $ne: excludeId } })
      .skip(skip)
      .limit(limit);
    return users;
  }

  static async getUser(userId: string): Promise<userDoc> {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError(`Can't find user with this id:${userId}`);
    return user;
  }

  static async getUserProfileAndPost(
    userId: string,
    skip: number,
    limit: number
  ): Promise<{ user: userDoc; posts: postDoc[] }> {
    const user = await this.getUser(userId);
    const posts = await PostService.getPostbyAuthIdDb(user.authId.toString(), skip, limit);

    return { user, posts };
  }

  static async getRandomUserSuggestionDb(
    userId: string,
    skip: number,
    limit: number
  ): Promise<redisUserAttrs[] | userDoc[]> {
    const users = await UserService.getAllUsers(userId, skip, limit);
    console.log(users.length);
    const followings = await FollowerService.getFollowingsIds(userId);

    const excludedUsers = users.filter((user) => {
      if (!followings.includes(user._id.toString())) return user;
    });

    return Helpers.suffleArray(excludedUsers);
  }

  static async updateSocialLink(userId: string, data: userUpdationSocialLink): Promise<void> {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError(`User regarding this id:${userId} not found`);

    const socialLinks = { ...user.socialMediaLinks, ...data };
    await userModel.findByIdAndUpdate(userId, { socialMediaLinks: socialLinks });
  }

  static async updateBasicinfo(userId: string, data: userUpdationBasicinfo): Promise<void> {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError(`User regarding this id:${userId} not found`);

    const basicInfo = { ...user?.basicInfo, ...data };
    await userModel.findByIdAndUpdate(userId, { basicInfo });
  }

  static async updateNotification(userId: string, data: userSettingsUpdationProp['notificationSettings']) {
    const user = await userModel.findById(userId);

    if (!user) throw new NotFoundError(`User regarding this id:${userId} not found`);

    const notification = { ...user.userSettings?.notificationSettings, ...data };

    await userModel.findByIdAndUpdate(userId, { $set: { 'userSetting.notificationSettings': notification } });
  }

  static async searchUsers(userName: string) {
    const authUsers = await authModel.aggregate([
      { $match: { userName: { $regex: `^${userName}[^a-zA-Z0-9]*`, $options: 'i' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: 'authId', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userName: 1,
          profileImg: '$user.profileImg',
          email: 1,
        },
      },
    ]);

    return authUsers;
  }

  static async getTotalUsersCount(): Promise<number> {
    const totalUsersCount = await userModel.find({}).countDocuments();
    return totalUsersCount;
  }
}
