import { followerDoc } from '@follower/interfaces/followerInterface';
import mongoose from 'mongoose';

const followerSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User',
  },

  followeeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User',
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

followerSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });

export const followerModel = mongoose.model<followerDoc>('Follower', followerSchema);
