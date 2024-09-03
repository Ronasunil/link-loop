import mongoose from 'mongoose';
import { commentDoc } from '../interfaces/commentInterface';

const commentSchema = new mongoose.Schema({
  userTo: {
    type: String,
    required: true,
  },

  userName: {
    type: String,
    required: true,
  },

  profilePic: {
    type: String,
    required: true,
  },

  authId: {
    type: mongoose.Types.ObjectId,
    ref: 'Auth',
    required: true,
    index: true,
  },

  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true,
  },

  comment: {
    type: String,
    required: true,
    default: '',
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const commentModel = mongoose.model<commentDoc>('Comment', commentSchema);
