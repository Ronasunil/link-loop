import { follower, redisFolloweAttr } from '@follower/interfaces/followerInterface';
import { BaseCache } from './baseCache';

import { userCache } from './userCache';
import { BadRequestError } from '@global/helpers/errorHandler';

class FollowerCache extends BaseCache {
  constructor() {
    super();
  }

  async addFollowee(data: redisFolloweAttr): Promise<void> {
    const { followerId, userId } = data;

    const isFollower = await this.client.hexists(`followersHash:${followerId}`, userId);

    if (isFollower) throw new BadRequestError('User has already been followed');

    await this.client.lpush(`followers:${followerId}`, userId);
    await this.client.lpush(`following:${userId}`, followerId);

    // stoing follower in hash for faster reteriving
    await Promise.all([
      this.client.hset(`followersHash:${followerId}`, userId, '1'),
      this.client.hset(`followingsHash:${userId}`, followerId, '1'),
    ]);

    await Promise.all([
      userCache.incrFollowCount(userId, 'followersCount', 1),
      userCache.incrFollowCount(followerId, 'followeeCount', 1),
    ]);
  }

  async removeFollowee(data: redisFolloweAttr): Promise<void> {
    const { followerId, userId } = data;

    const unfollowUser = await this.client.lrem(`followers:${userId}`, 1, followerId);
    const removeFollowing = await this.client.lrem(`following:${followerId}`, 1, userId);

    await this.client.hdel(`followersHash:${userId}`, followerId);
    await this.client.hdel(`followingsHash:${followerId}`, userId);

    const decFollowerCount = userCache.incrFollowCount(userId, 'followersCount', -1);
    const decFolloweeCount = userCache.incrFollowCount(followerId, 'followeeCount', -1);

    await Promise.all([unfollowUser, decFollowerCount, decFolloweeCount, removeFollowing]);
  }

  async getFollowData(
    followType: 'followers' | 'following',
    userId: string,
    skip: number,
    limit: number
  ): Promise<follower[]> {
    const followers: follower[] = [];
    const followersIds = await this.client.lrange(`${followType}:${userId}`, skip, limit);

    for (let followerId of followersIds) {
      const { followeeCount, followersCount, totalPost, profilePic, userName } = await userCache.getUser(followerId);
      const followerData: follower = {
        followeeCount,
        followersCount,
        totalPost,
        profilePic,
        userId,
        userName,
      };

      followers.push(followerData);
    }

    return followers;
  }
}

export const followerCache = new FollowerCache();
