import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { NotificationService } from '@services/db/notificationService';
import { notificationSocket } from '@utils/features/sockets/notificationSocket';

class Update {
  async notification(req: Request, res: Response) {
    const { notificationId } = req.params as { notificationId: string };

    const updatedNotification = await NotificationService.updateNotification(notificationId);

    if (!updatedNotification) return res.status(httpStatus.NOT_FOUND).json({ message: 'Nothing updated' });
    notificationSocket.emit('updated notification', updatedNotification, {
      userTo: updatedNotification.userTo,
      notificationId,
    });
    res.status(httpStatus.OK).json({ message: 'Notification updated', updatedNotification });
  }
}

export const update = new Update();
