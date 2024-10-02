import { Response, Request } from 'express';
import httpStatus from 'http-status-codes';

import { chatCache } from '@services/redis/chatCache';

class Destroy {
  async userChats(req: Request, res: Response) {
    const { identifier } = req.params as { identifier: string };
    await chatCache.removeUserChats(identifier);

    res.status(httpStatus.NO_CONTENT).json({ message: 'chat has been deleted' });
  }
}

export const destroy = new Destroy();
