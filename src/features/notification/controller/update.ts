import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { NotificationService } from '@services/db/notificationService';

class Update {
  async notification(req: Request, res: Response) {
    const { notificationId } = req.params as { notificationId: string };

    await NotificationService.updateNotification(notificationId);
    res.status(httpStatus.OK).json({ message: 'Notification updated' });
  }
}

export const update = new Update();
