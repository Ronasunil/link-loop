import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { followerCache } from '@services/redis/followerCache';
import { FollowerWorker, UnfollowerWorker } from '@workers/followerWorker';

class Destroy {
  async follow(req: Request, res: Response) {
    const { followerId } = req.params as { followerId: string };
    const userId = req.currentUser!._id.toString();

    await followerCache.removeFollowee({ followerId, userId });
    const followerWorker = await new UnfollowerWorker().preparQueueForUnFollow({ followerId, userId });
    followerWorker.unfollow();

    res.status(httpStatus.OK).json({ message: 'User has been unfollowed', status: 'OK' });
  }
}

export const destroy = new Destroy();
