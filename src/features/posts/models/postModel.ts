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
  email: String,

  authId: {
    type: mongoose.Types.ObjectId,
    ref: 'Auth',
    index: true,
  },

  totalComments: {
    type: Number,
    default: 0,
  },

  comments: [
    {
      authId: { type: mongoose.Types.ObjectId, ref: 'Auth' },
      postId: { type: mongoose.Types.ObjectId, ref: 'Post' },
      avatarImage: String,
      email: String,
    },
  ],

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
