import mongoose from 'mongoose';

export interface followerAttr {
  _id: string | mongoose.Types.ObjectId;
  followerId: string | mongoose.Types.ObjectId;
  followeeId: string | mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface redisFolloweAttr {
  userId: string;
  followerId: string;
}

export interface dbFolloweAttr {
  userId: string;
  followerId: string;
}

export interface followerData {
  userId: string;
  profilePic: string;
  followersCount: number;
  followeeCount: number;
  followerId: string;
  totalPost: number;
}

export interface follower {
  userId: string;
  profilePic: string;
  followersCount: number;
  followeeCount: number;
  totalPost: number;
  userName: string;
}

export interface followerDoc extends mongoose.Document {
  _id: string | mongoose.Types.ObjectId;
  followerId: string | mongoose.Types.ObjectId;
  followeeId: string | mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface blockJob {
  userId: string;
  blockUserId: string;
}

export interface unblockJob {
  userId: string;
  unblockUserId: string;
}
