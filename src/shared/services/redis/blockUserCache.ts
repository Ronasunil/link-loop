const _ = require('lodash');
import { redisUserAttrs } from '@utils/features/users/interface/user.interface';
import { BaseCache } from './baseCache';
import { userCache } from './userCache';

class BlockUserCache extends BaseCache {
  constructor() {
    super();
  }

  async BlockUser(userId: string, blockUserId: string) {
    console.log(userId, blockUserId, 'pppp');
    const [user, blockingUser] = await Promise.all([userCache.getUser(userId), userCache.getUser(blockUserId)]);

    const blocked = user.blocked;
    const blockedBy = blockingUser.blockedBy;
    blocked.push(blockUserId);
    blockedBy.push(userId);

    const updatedUser = JSON.stringify({ ...user, blocked } as redisUserAttrs);
    const updatedBlockingUser = JSON.stringify({ ...blockingUser, blockedBy } as redisUserAttrs);

    await Promise.all([
      this.client.set(`user:${userId}`, updatedUser),
      this.client.set(`user:${blockUserId}`, updatedBlockingUser),
    ]);
  }

  async unblockUser(userId: string, unBlockUserId: string) {
    const [user, unBlockingUser] = await Promise.all([userCache.getUser(userId), userCache.getUser(unBlockUserId)]);

    const blocked = user.blocked;
    const blockedBy = unBlockingUser.blockedBy;
    _.remove(blocked, (id: any) => id === unBlockUserId);
    _.remove(blockedBy, (id: any) => id === userId);

    const updatedUser = JSON.stringify({ ...user, blocked } as redisUserAttrs);
    const updatedUnblockingUser = JSON.stringify({ ...unBlockingUser, blockedBy } as redisUserAttrs);

    await Promise.all([
      this.client.set(`user:${userId}`, updatedUser),
      this.client.set(`user:${unBlockUserId}`, updatedUnblockingUser),
    ]);
  }
}

export const blockUserCache = new BlockUserCache();
