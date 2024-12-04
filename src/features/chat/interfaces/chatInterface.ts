import { reactions } from '@reaction/interfaces/reactionInterface';
import { ChatService } from '@services/db/chatService';
import { redisUserAttrs } from '@utils/features/users/interface/user.interface';
import { Request } from 'express';
import mongoose from 'mongoose';

export type deleteType = 'deleteForme' | 'deleteForEveryone';

export interface chatDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  reciverId: mongoose.Types.ObjectId;
  senderName: string;
  reciverName: string;
  senderProfileImg: string;
  reciverProfileImg: string;
  message: string;
  image: string;
  gif: string;
  deleteForMe: Boolean;
  deleteForEveryone: Boolean;
  isRead: Boolean;
  isDelivered: Boolean;
  createdAt: Date;
  reaction: chatReaction[];
}

export interface chatReaction {
  type: string;
  senderName: string;
}

export interface chatAttrs {
  _id: string;
  conversationId: string;
  senderId: string;
  reciverId: string;
  senderName: string;
  reciverName: string;
  senderProfileImg: string;
  reciverProfileImg: string;
  message: string;
  image: string;
  gif: string;
  deleteForMe: Boolean;
  deleteForEveryone: Boolean;
  isRead: Boolean;
  isDelivered: Boolean;
  createdAt: Date;
  reaction: chatReaction[];
}

export interface messagingUsers {
  userOne: redisUserAttrs;
  userTwo: redisUserAttrs;
}

// export interface messageNotification {
//   userFrom: mongoose.Types.ObjectId;
//   userFromProfileImg: string;
//   userTo: mongoose.Types.ObjectId;
//   message: string;
// }

export interface deleteJob {
  type: deleteType;
  messageId: string;
}

export interface reactionJob {
  messageId: string;
  reactionType: string;
  senderName: string;
}

export interface deliveredJob {
  userId: string;
}

export interface chatList {
  reciverId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
}

export interface reqForChat extends Request {
  body: {
    conversationId: string;
    senderId: string;
    reciverId: string;
    reciverProfileImg: string;
    reciverName: string;
    message: string;
    image: string;
    gif: string;
  };
}

export interface reqForAddingChatUsers extends Request {
  body: {
    userOne: string;
    userTwo: string;
  };
}

export interface reqForMessageDeletion extends Request {
  body: {
    type: deleteType;
  };
}

export interface senderReciver {
  senderId: string;
  reciverId: string;
  senderName: string;
  reciverName: string;
}

export interface conversation {
  conversationId: string;
  receiverId: string;
  senderId: string;
}
