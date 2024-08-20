import { redisUserAttrs } from '@utils/features/users/interface/user.interface';
import { BaseCache } from './baseCache';
import { BadRequestError } from '@global/helpers/errorHandler';
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
    console.log(identifier);
    if (!user) throw new BadRequestError(`Can't find user`);

    return JSON.parse(user);
  }
}

export const userCache = new UserCache();
