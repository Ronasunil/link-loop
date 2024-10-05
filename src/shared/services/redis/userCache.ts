import {
  redisUserAttrs,
  redisUserUpdationProp,
  userDoc,
  userSettingsUpdationProp,
} from '@utils/features/users/interface/user.interface';
import { BaseCache } from './baseCache';
import { BadRequestError, NotFoundError } from '@global/helpers/errorHandler';
import mongoose from 'mongoose';
import { postCache } from './postCache';
import { postAttrs } from '@post/interfaces/postInterfaces';
import { followerCache } from './followerCache';
import { Helpers } from '@global/helpers/helpers';

export class UserCache extends BaseCache {
  constructor() {
    super();
  }

  public async addUser(user: redisUserAttrs) {
    const { _id: userId } = user;
    const dataString = JSON.stringify(user);
    await this.client.set(`user:${userId}`, dataString);

    await this.client.sadd(`userIds`, `user:${userId}`);
  }

  async getUser(identifier: string | mongoose.Types.ObjectId): Promise<redisUserAttrs> {
    const user = await this.client.get(`user:${identifier}`);

    if (!user) throw new BadRequestError(`Can't find user`);

    return JSON.parse(user);
  }

  async getUserProfileAndPost(
    userId: string,
    authId: string,
    skip: number,
    limit: number
  ): Promise<{
    user: redisUserAttrs;
    posts: [] | postAttrs[];
  }> {
    const user = await this.getUser(userId);
    const posts = await postCache.getPostsByAuthId(authId, skip, limit);

    return { user, posts };
  }

  async getRandomUserSuggestion(
    userId: string,
    skip: number = 0,
    limit: number = 10
  ): Promise<redisUserAttrs[] | userDoc[]> {
    const users = await this.getAllusers(userId, skip, limit);
    const followings = await followerCache.getFollowees(userId);

    const excludedUsers = users.filter((user) => {
      if (!followings.includes(user._id.toString())) return user;
    });

    return Helpers.suffleArray(excludedUsers);
  }

  async getAllusers(excludeId: string, skip: number, limit: number): Promise<redisUserAttrs[]> {
    const users: redisUserAttrs[] = [];

    const userIds = (await this.client.smembers('userIds')).slice(skip, limit);
    // console.log(userIds, userIds.length, limit);
    for (const id of userIds) {
      if (id === `user:${excludeId}`) continue;
      const user = await this.getUser(id);
      users.push(user);
    }
    console.log(users);
    return users;
  }

  async getTotalUser(): Promise<number> {
    const users = await this.client.smembers('userIds');
    return users.length;
  }

  async updateUser(userId: string | mongoose.Types.ObjectId, data: redisUserUpdationProp): Promise<redisUserAttrs> {
    const user = await this.getUser(userId);
    const updatedData = JSON.stringify({ ...user, ...data });

    this.client.set(`user:${userId}`, updatedData);
    return JSON.parse(updatedData) as redisUserAttrs;
  }

  async updateBasicInfo(userId: string, data: redisUserUpdationProp['basicInfo']): Promise<redisUserAttrs> {
    const user = await this.getUser(userId);

    user.basicInfo = { ...user.basicInfo, ...data };

    await this.client.set(`user:${userId}`, JSON.stringify(user));
    return user;
  }

  async updateNotification(
    userId: string,
    data: userSettingsUpdationProp['notificationSettings']
  ): Promise<redisUserAttrs> {
    const user = await this.getUser(userId);
    const notificationSettings = user.userSettings.notificationSettings;
    user.userSettings.notificationSettings = { ...notificationSettings, ...data };

    this.client.set(`users:${userId}`, JSON.stringify(user));

    return user;
  }

  async updateSocialLinks(userId: string, data: redisUserUpdationProp['socialMediaLinks']) {
    const user = await this.getUser(userId);
    console.log({ ...data, ...user.socialMediaLinks }, data, user.socialMediaLinks);

    if (data?.facebook) user.socialMediaLinks.facebook = data.facebook;
    if (data?.instagram) user.socialMediaLinks.instagram = data.instagram;

    await this.client.set(`user:${userId}`, JSON.stringify(user));
    return user;
  }

  async incrFollowCount(userId: string, key: 'followeeCount' | 'followersCount', value: number) {
    const user = await this.getUser(userId);
    const updatedCount = user[key] + value;

    const updatedData = JSON.stringify({ ...user, [key]: updatedCount });
    this.client.set(`user:${userId}`, updatedData);
  }
}

export const userCache = new UserCache();
