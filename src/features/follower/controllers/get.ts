import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { Helpers } from '@global/helpers/helpers';
import { FollowerService } from '@services/db/followerService';
import { followerCache } from '@services/redis/followerCache';

class Get {
  async userFollowers(req: Request, res: Response) {
    const { userId } = req.params as { userId: string };
    const { page } = req.query as { page?: string };
    const pageNo = Number.parseInt(page || '1');
    const { limit, skip } = Helpers.paginate(pageNo);

    const followersCache = await followerCache.getFollowData('followers', userId, skip, limit);

    const followers = followersCache.length
      ? followersCache
      : await FollowerService.getFollowData('followerId', userId, skip, limit);

    res.status(httpStatus.OK).json({ followers });
  }

  async userFollowees(req: Request, res: Response) {
    const { userId } = req.params as { userId: string };
    const { page } = req.query as { page?: string };
    const pageNo = Number.parseInt(page || '1');
    const { limit, skip } = Helpers.paginate(pageNo);

    const followeesCache = await followerCache.getFollowData('following', userId, skip, limit);

    const followees = followeesCache.length
      ? followeesCache
      : await FollowerService.getFollowData('followeeId', userId, skip, limit);

    res.status(httpStatus.OK).json({ followees });
  }

  async checkUserFollows(req: Request, res: Response) {
    const { userId, checkingUserId } = req.params as { userId: string; checkingUserId: string };

    const result = await followerCache.checkUserFollowing(userId, checkingUserId);

    res.status(httpStatus.OK).json({ result });
  }
}

export const get = new Get();
