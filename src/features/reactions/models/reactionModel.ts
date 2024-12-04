import { reactionDoc } from '@reaction/interfaces/reactionInterface';
import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      required: true,
      default: '',
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
      index: true,
    },
    userFrom: {
      type: String,
      required: true,
    },

    userTo: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },

    reactionType: {
      type: String,
      enum: ['like', 'sad', 'happy', 'love', 'wow', 'angry'],
    },

    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    toJSON: {
      transform: function (_doc, ret) {
        delete ret.__v;
      },
    },
  }
);

export const reactionModel = mongoose.model<reactionDoc>('Reaction', reactionSchema);
