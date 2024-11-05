import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { AuthService } from '@services/db/authService';
import { UserCache } from '@services/redis/userCache';
import { NotAuthorizedError } from '@global/helpers/errorHandler';

class CurrentUser {
  async get(req: Request, res: Response) {
    const cacheUser = await new UserCache().getUser(req.currentUser?._id as string);
    const user = cacheUser ? cacheUser : AuthService.getUserByid(req.currentUser?._id as string);

    if (!user) throw new NotAuthorizedError('Unauthorized access');
    res.status(httpStatus.OK).json({ user });
  }
}

export const curentUser = new CurrentUser();
