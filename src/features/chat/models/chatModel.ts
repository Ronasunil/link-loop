import mongoose from 'mongoose';
import { chatDoc } from '../interfaces/chatInterface';

const chatSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Types.ObjectId,
    ref: 'Conversation',
    index: true,
  },
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  senderName: {
    type: String,
    required: true,
  },

  senderProfileImg: {
    type: String,
    required: true,
  },

  reciverId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  reciverName: {
    type: String,
    required: true,
  },

  reciverProfileImg: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    default: '',
  },

  image: {
    type: String,
    default: '',
  },

  gif: {
    type: String,
    default: '',
  },

  reaction: Array,

  deleteForMe: {
    type: Boolean,
    default: false,
  },

  deleteForEveryone: {
    type: Boolean,
    default: false,
  },

  isRead: {
    type: Boolean,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const chatModel = mongoose.model<chatDoc>('Chat', chatSchema);
