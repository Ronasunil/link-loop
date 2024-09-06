import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { blockUserCache } from '@services/redis/blockUserCache';
import { BlockWorker } from '@workers/blockWorker';

class UserBlockManager {
  async block(req: Request, res: Response) {
    const { blockUserId } = req.params as { blockUserId: string };
    const userId = req.currentUser!._id.toString();

    await blockUserCache.BlockUser(userId, blockUserId);

    const blockWorker = await new BlockWorker().prepareQueueForBlock({ userId, blockUserId });
    blockWorker.blockUser();

    res.status(httpStatus.OK).json({ message: 'User blocked' });
  }

  async unblock(req: Request, res: Response) {
    const { unblockUserId } = req.params as { unblockUserId: string };
    const userId = req.currentUser!._id.toString();

    await blockUserCache.unblockUser(userId, unblockUserId);

    const blockWorker = await new BlockWorker().prepareQueueForUnblock({ userId, unblockUserId });
    blockWorker.unblockUser();

    res.status(httpStatus.OK).json({ message: 'User unblocked' });
  }
}

export const userBlockManager = new UserBlockManager();
