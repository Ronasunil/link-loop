import mongoose from 'mongoose';
import { notification, notificationDoc } from '../interfaces/notificationInterface';
import { NotificationService } from '@services/db/notificationService';

const notificationSchema = new mongoose.Schema({
  userTo: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  userFrom: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  read: {
    type: Boolean,
    default: false,
  },

  message: {
    type: String,
    default: '',
    required: true,
  },

  entityId: mongoose.Types.ObjectId,
  createdItemId: mongoose.Types.ObjectId,

  notificationType: { type: String, required: true },
  comment: { type: String, default: '' },
  reaction: { type: String, default: '' },
  post: { type: String, default: '' },
  imgId: { type: String, default: '' },
  imgVersion: { type: String, default: '' },
  createdAt: { type: Date, default: new Date() },
});

notificationSchema.methods.insertNotification = async function (data: notification): Promise<string> {
  const { userTo } = data;
  await NotificationService.createNotificationDB(data);
  return userTo.toString();
};

export const notificationModel = mongoose.model<notificationDoc>('Notification', notificationSchema);
