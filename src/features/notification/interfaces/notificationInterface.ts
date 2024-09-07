import mongoose from 'mongoose';

export interface notification {
  userTo: mongoose.Types.ObjectId | string;
  userFrom: mongoose.Types.ObjectId | string;
  read: Boolean;
  message: string;
  entityId: string;
  createdItemId: string;
  notificationType: string;
  comment: string;
  reaction: string;
  post: string;
  imageId: string;
  imageVersion: string;
  profileImg?: string;
  createdAt: Date;
}

export interface notificationDoc extends mongoose.Document {
  userTo: mongoose.Types.ObjectId;
  userFrom: mongoose.Types.ObjectId;
  read: Boolean;
  message: string;
  entityId: string;
  createdItemId: string;
  notificationType: string;
  comment: string;
  reaction: string;
  post: string;
  imageId: string;
  imageVersion: string;
  createdAt: Date;
  insertNotification: (data: notification) => Promise<string>;
}
