import mongoose from 'mongoose';
import { Request } from 'express';

export interface commentAttrs {
  _id: string | mongoose.Types.ObjectId;
  userTo: string;
  userFrom: string;
  userName: string;
  profilePic: string;
  authId: string;
  postId: string;
  comment: string;
  createdAt: Date;
}

export interface commentDoc extends mongoose.Document {
  _id: string | mongoose.Types.ObjectId;
  userTo: string;
  userFrom: string;
  userName: string;
  profilePic: string;
  authId: string;
  postId: string;
  comment: string;
  createdAt: Date;
}

export interface commentUpdationProps {
  comment: string;
}

export interface commentNamesList {
  count: number;
  names: string[];
}

export interface reqForCommentCreation extends Request {
  body: {
    userTo: string;
    postId: string;
    comment: string;
    profilePic: string;
  };
}

export interface commentParam {
  postId: string;
  commentId: string;
}

export interface reqForCommentUpdation extends Request {
  body: {
    comment: string;
  };
}

export interface reqForGettingPostComments extends Request {
  params: {
    postId: string;
  };
}

export interface reqForGettingComment extends Request<commentParam> {
  params: commentParam;
}
