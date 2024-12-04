import { Request } from 'express';
import mongoose from 'mongoose';

export interface reactionAttrs {
  _id: string | mongoose.Types.ObjectId;
  profilePic: string;
  userName: string;
  postId: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  userFrom: string | mongoose.Types.ObjectId;
  userTo: string | mongoose.Types.ObjectId;
  reactionType: reactionType;
  createdAt: Date;
}

export interface reactionDoc extends mongoose.Document {
  _id: string | mongoose.Types.ObjectId;
  profilePic: string;
  userName: string;
  postId: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  userFrom: string | mongoose.Types.ObjectId;
  userTo: string | mongoose.Types.ObjectId;
  reactionType: reactionType;
  createdAt: Date;
}

export interface reactions {
  like: number;
  sad: number;
  happy: number;
  love: number;
  wow: number;
  angry: number;
}

export enum reactionType {
  like = 'like',
  sad = 'sad',
  love = 'love',
  happy = 'happy',
  wow = 'wow',
  angry = 'angry',
}

export interface reactionProp {
  profilePic: string;
  userName: string;
  postId: string;
  reactionType: reactionType;
  userTo: string;
}

export interface reqForAddReactions extends Request {
  body: reactionProp;
}

export interface reqForGettingReactions extends Request {
  params: {
    postId: string;
  };
  query: {
    page?: string;
  };
}

export interface reqForCheckingReactionsExist extends Request {
  params: {
    userId: string;
    postId: string;
  };
}

// export interface reqForGettingUserReaction {
//   params: {
//     userId: string;
//   };
//   query: {
//     page?: string;
//   };
// }
