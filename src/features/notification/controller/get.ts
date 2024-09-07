import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { NotificationService } from '@services/db/notificationService';

class Get {
  async notification(req: Request, res: Response) {
    const userId = req.currentUser!._id;

    const notifications = await NotificationService.getNotificationsDB(userId.toString());

    res.status(httpStatus.OK).json({ notifications });
  }
}

export const get = new Get();
