import mongoose from 'mongoose';
import { Request } from 'express';

export interface imageDoc extends mongoose.Document {
  userId: mongoose.Types.ObjectId | string;
  imageId: string;
  imageVersion: string;
  bgImageVersion: string;
  bgImageId: string;
  createdAt: Date;
}

export interface imageAttr {
  _id: string | mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  imageId: string;
  imageVersion: string;
  bgImageVersion: string;
  bgImageId: string;
  createdAt: Date;
}

export interface imageWorkerJob {
  userId: mongoose.Types.ObjectId | string;
  imageId: string;
  imageVersion: string;
  url: string;
  type: 'profile' | 'bg';
}

export interface deleteWorkerJob {
  userId: string;
  imageId: string;
}

export interface reqForAddingImage extends Request {
  body: {
    image: string;
  };
}
