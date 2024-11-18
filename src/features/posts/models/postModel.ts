import mongoose from 'mongoose';
import { postDoc } from '@post/interfaces/postInterfaces';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    default: '',
  },

  totalReaction: {
    type: Number,
    default: 0,
  },

  profilePic: {
    type: String,
    default: '',
  },
  username: String,
  email: String,
  text: String,

  authId: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Auth',
    index: true,
  },

  userId: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'User',
    index: true,
  },

  totalComments: {
    type: Number,
    default: 0,
  },

  reactions: {
    like: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
  },

  gifUrl: {
    type: String,
    default: '',
  },

  privacy: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public',
  },

  imageId: { type: String, default: '' },
  imageVersion: { type: String, default: '' },

  videoId: { type: String, default: '' },
  videoVersion: { type: String, default: '' },

  feelings: { type: String, default: '' },

  bgColor: {
    type: String,
    default: 'white',
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const postModel = mongoose.model<postDoc>('Post', postSchema);
