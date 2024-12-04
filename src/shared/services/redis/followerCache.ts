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
    // abin follows rona
    // follwoerId = abin and userId= rona
    // so rohan must be following  rona? so following:rona  = abin id
    //  and in  abin follower there mus be rona so followers:abin = rona id

    const isFollower = await this.client.hexists(`followersHash:${followerId}`, userId);

    if (isFollower) throw new BadRequestError('User has already been followed');

    await this.client.lpush(`followers:${followerId}`, userId);
    await this.client.lpush(`following:${userId}`, followerId);

    // storing follower in hash for faster reteriving
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

    const unfollowUser = await this.client.lrem(`followers:${followerId}`, 1, userId);
    const removeFollowing = await this.client.lrem(`following:${userId}`, 1, followerId);

    const res = await this.client.hdel(`followersHash:${followerId}`, userId);
    const res1 = await this.client.hdel(`followingsHash:${userId}`, followerId);
    console.log(res, res1, followerId, userId);

    const decFollowerCount = userCache.incrFollowCount(userId, 'followersCount', -1);
    const decFolloweeCount = userCache.incrFollowCount(followerId, 'followeeCount', -1);

    await Promise.all([unfollowUser, decFollowerCount, decFolloweeCount, removeFollowing]);
  }

  async getFollowers(userId: string): Promise<string[]> {
    const followersIds = await this.client.lrange(`followers:${userId}`, 0, -1);
    return followersIds;
  }

  async getFollowees(userId: string): Promise<string[]> {
    const followersIds = await this.client.lrange(`following:${userId}`, 0, -1);
    return followersIds;
  }

  async getFollowData(
    followType: 'followers' | 'following',
    userId: string,
    skip: number,
    limit: number
  ): Promise<follower[]> {
    const followers: follower[] = [];
    const followersIds = await this.client.lrange(`${followType}:${userId}`, skip, limit);
    console.log(followType, userId, followersIds);
    for (let followerId of followersIds) {
      const { followeeCount, followersCount, totalPost, profileImg, userName } = await userCache.getUser(followerId);
      const followerData: follower = {
        followeeCount,
        followersCount,
        totalPost,
        profileImg,
        userId: followerId,
        userName,
      };

      followers.push(followerData);
    }

    return followers;
  }
  async checkUserFollowing(userId: string, checkingUserId: string): Promise<Boolean> {
    const result = await this.client.hget(`followingsHash:${userId}`, checkingUserId);

    if (!result) return false;
    return true;
  }
}

export const followerCache = new FollowerCache();
