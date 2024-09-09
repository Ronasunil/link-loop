import mongoose from 'mongoose';
import { imageDoc } from '../interfaces/imageInterface';

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    index: true,
  },

  imageId: {
    type: String,
    default: '',
  },

  imageVersion: {
    type: String,
    default: '',
  },

  bgImageVersion: {
    type: String,
    default: '',
  },

  bgImageId: {
    type: String,
    default: '',
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const imageModel = mongoose.model<imageDoc>('Image', imageSchema);
