import { redisUserAttrs, redisUserUpdationProp } from '@utils/features/users/interface/user.interface';
import { BaseCache } from './baseCache';
import { BadRequestError, NotFoundError } from '@global/helpers/errorHandler';
import mongoose from 'mongoose';

export class UserCache extends BaseCache {
  constructor() {
    super();
  }

  public async addUser(user: redisUserAttrs) {
    const { _id: userId } = user;
    const dataString = JSON.stringify(user);
    await this.client.set(`user:${userId}`, dataString);
  }

  async getUser(identifier: string | mongoose.Types.ObjectId): Promise<redisUserAttrs> {
    const user = await this.client.get(`user:${identifier}`);

    if (!user) throw new BadRequestError(`Can't find user`);

    return JSON.parse(user);
  }

  async updateUser(userId: string | mongoose.Types.ObjectId, data: redisUserUpdationProp) {
    const user = this.getUser(userId);
    const updatedData = JSON.stringify({ ...user, ...data });

    this.client.set(`user:${userId}`, updatedData);
  }

  async incrFollowCount(userId: string, key: 'followeeCount' | 'followersCount', value: number) {
    const user = await this.getUser(userId);
    const updatedCount = user[key] + value;

    const updatedData = JSON.stringify({ ...user, [key]: updatedCount });
    this.client.set(`user:${userId}`, updatedData);
  }
}

export const userCache = new UserCache();
