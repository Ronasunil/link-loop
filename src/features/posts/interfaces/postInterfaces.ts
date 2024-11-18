import mongoose from 'mongoose';
import { Request } from 'express';

import { reactions } from '@reaction/interfaces/reactionInterface';

export interface postDoc extends mongoose.Document {
  _id: string | mongoose.Types.ObjectId;
  content: string;
  totalReaction: number;
  profilePic: string;
  username: string;
  email: string;
  authId: string;
  userId: string | mongoose.Types.ObjectId;
  totalComments: number;
  reactions: reactions;
  gifUrl: string;
  privacy: privacyEnum;
  imageId: string;
  imageVersion: string;
  videoId: string;
  videoVersion: string;
  feelings: string;
  bgColor: string;
  createdAt: Date;
}

export interface postAttrs {
  _id: string | mongoose.Types.ObjectId;
  content: string;
  totalReaction: number;
  profilePic: string;
  username: string;
  email: string;
  authId: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  totalComments: number;
  reactions: reactions;
  gifUrl: string;
  privacy: privacyEnum;
  imageId: string;
  imageVersion: string;
  videoId: string;
  videoVersion: string;
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

export interface reqWithVideoPostProps extends Request {
  body: {
    video: string;
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
  username: string;
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
  video?: string;
  videoId?: string;
  videoVersion?: string;
  reactions?: reactions;
  totalReaction?: number;
  totalComments?: number;
  username?: string;
}

export interface reqWithPostUpdationProps extends Request {
  body: postWithImageUpdationProps;
  params: {
    postId: string;
  };
}

export interface reqWithPostImageProps extends Request {
  body: {
    content: string;
    bgColor: string;
    feelings: string;
    privacy: privacyEnum;
    gifUrl: string;
    profilePic: string;
    image: string;
  };
}

export interface reqForGetAllPostsProps extends Request {
  query: {
    page?: string;
  };
}

export interface reqForGetPostByAuthId extends Request {
  params: {
    authId: string;
  };

  query: {
    page?: string;
  };
}

export interface reqForGetPostImgByAuthId extends Request {
  params: {
    authId: string;
  };

  query: {
    page?: string;
  };
}
export interface reqForGetPostById extends Request {
  params: {
    postId: string;
  };
}
