import mongoose from 'mongoose';
import { Request } from 'express';

import { reactions } from '@reaction/interfaces/reactionInterface';

export interface postDoc extends mongoose.Document {
  _id: string | mongoose.Types.ObjectId;
  content: string;
  totalReaction: number;
  profilePic: string;
  email: string;
  authId: string;
  totalComments: number;
  reactions: reactions;
  comments: comments[];
  gifUrl: string;
  privacy: privacyEnum;
  imageId: string;
  imageVersion: string;
  feelings: string;
  bgColor: string;
  createdAt: Date;
}

export interface postAttrs {
  _id: string | mongoose.Types.ObjectId;
  content: string;
  totalReaction: number;
  profilePic: string;
  email: string;
  authId: string | mongoose.Types.ObjectId;
  totalComments: number;
  reactions: reactions;
  comments: comments[];
  gifUrl: string;
  privacy: privacyEnum;
  imageId: string;
  imageVersion: string;
  feelings: string;
  bgColor: string;
  createdAt: Date;
}

export enum privacyEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

export interface comments {
  authId: string | mongoose.Types.ObjectId;
  postId: string | mongoose.Types.ObjectId;
  profilePic: string;
  email: string;
}

export interface imageParams {
  imageVersion: string;
  imageId: string;
}

export interface reqWithPostProps extends Request {
  body: {
    content: string;
    bgColor: string;
    feelings: string;
    privacy: privacyEnum;
    gifUrl: string;
    profilePic: string;
  };
}

export interface postUpdationProps {
  content: string;
  bgColor: string;
  feelings: string;
  privacy: privacyEnum;
  gifUrl: string;
  profilePic: string;
}

export interface postWithImageUpdationProps {
  content?: string;
  bgColor?: string;
  feelings?: string;
  privacy?: privacyEnum;
  gifUrl?: string;
  profilePic?: string;
  image?: string;
  imageId?: string;
  imageVersion?: string;
  reactions?: reactions;
  totalReaction?: number;
}

export interface reqWithPostUpdationProps extends Request {
  body: postWithImageUpdationProps;
  params: {
    postId: string;
  };
}
