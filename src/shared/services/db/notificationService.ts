import { notification, notificationDoc } from '@utils/features/notification/interfaces/notificationInterface';
import { notificationModel } from '@utils/features/notification/model/notificationModel';

export class NotificationService {
  static async createNotificationDB(data: notification): Promise<void> {
    await notificationModel.create(data);
  }

  static async getNotificationsDB(userId: string): Promise<notificationDoc[]> {
    const notifications = await notificationModel
      .find({ userTo: userId })
      .populate({ path: 'userTo', select: 'name, email, profileImg' });

    return notifications;
  }

  static async updateNotification(notficationId: string): Promise<void> {
    await notificationModel.findByIdAndUpdate(notficationId, { read: true });
  }
}
