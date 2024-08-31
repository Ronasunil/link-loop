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
    authId: {
      type: mongoose.Types.ObjectId,
      ref: 'Auth',
    },

    reactionType: {
      type: String,
      enum: ['like', 'sad', 'laugh', 'wow', 'angry'],
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
