import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { followerData } from '@follower/interfaces/followerInterface';
import { followerCache } from '@services/redis/followerCache';
import { userCache } from '@services/redis/userCache';
import { followerSocketIo } from '@utils/features/sockets/followerSocket';
import { redisUserAttrs } from '@utils/features/users/interface/user.interface';
import { FollowerWorker } from '@workers/followerWorker';

class Follow {
  async followuser(req: Request, res: Response) {
    const { followerId } = req.params as { followerId: string };
    const userId = req.currentUser!._id.toString();

    await followerCache.addFollowee({ followerId, userId });

    const user = await userCache.getUser(userId);

    const socketData = Follow.prototype.followData(user, followerId);
    followerSocketIo.emit('add follower', socketData);

    const followerWorker = await new FollowerWorker().prepareQueueForFollowing({ followerId, userId });
    followerWorker.follow();

    res.status(httpStatus.OK).json({ message: 'User has been followed', status: 'OK' });
  }

  private followData(userData: redisUserAttrs, followerId: string): followerData {
    return {
      followeeCount: userData.followeeCount,
      followersCount: userData.followersCount,
      totalPost: userData.totalPost,
      profileImg: userData.profileImg,
      userId: userData._id.toString(),
      followerId,
    };
  }
}

export const follow = new Follow();
