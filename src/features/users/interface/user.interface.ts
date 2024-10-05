import { Request } from 'express';
import mongoose from 'mongoose';

export interface redisUserAttrs {
  _id: string | mongoose.Types.ObjectId;
  role: string;
  name: string;
  userName: string;
  email: string;
  avatarColor: string;
  avatarImage: string;
  dob: Date | string;
  passwordResetExpires: Date | string;
  passwordResetToken: string;
  isBanned: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  userSettings: userSettings;
  socialMediaLinks: socialMediaLinks;
  profileImg: string;
  basicInfo: { quote: string; school: string; job: string; location: string };
  followersCount: number;
  followeeCount: number;
  bgImageVersion: string;
  bgImageId: string;
  blocked: string[];
  blockedBy: string[];
  totalPost: number;
  bgImg: string;
  imgVersion: string;
  imgId: string;
}

export interface redisUserUpdationProp {
  role?: string;
  name?: string;
  userName?: string;
  email?: string;
  avatarColor?: string;
  avatarImage?: string;
  dob?: Date | string;
  bgImg?: string;
  passwordResetExpires?: Date | string;
  passwordResetToken?: string;
  isBanned?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  userSettings?: userSettingsUpdationProp;
  socialMediaLinks?: { facebook?: string; instagram?: string };
  basicInfo?: { quote?: string; school?: string; job?: string; location?: string };
  profileImg?: string;
  followersCount?: number;
  followeeCount?: number;
  blocked?: string[];
  blockedBy?: string[];
  totalPost?: number;
  bgImageVersion?: string;
  bgImageId?: string;
  imgVersion?: string;
  imgId?: string;
}

export interface userAttrs {
  _id: string | mongoose.Types.ObjectId;
  authId: string | mongoose.Types.ObjectId;
  role?: string;
  name: string;
  dob?: Date | string;
  bgImg?: string;
  isBanned?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  userSettings?: userSettings;
  socialMediaLinks?: socialMediaLinks;
  profileImg?: string;
  followersCount?: number;
  followeeCount?: number;
  totalPost?: number;
  basicInfo: { quote: string; school: string; job: string; location: string };
}

export interface userDoc extends mongoose.Document {
  authId: string | mongoose.Types.ObjectId;
  _id: string | mongoose.Types.ObjectId;
  role: string;
  name: string;
  dob: Date | string;
  isBanned: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  userSettings: userSettings;
  socialMediaLinks: socialMediaLinks;
  profileImg: string;
  followersCount: number;
  followeeCount: number;
  bgImg: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  basicInfo: { quote: string; school: string; job: string; location: string };
  totalPost: number;
}

export interface userUpdationSocialLink {
  facebook?: string;
  instagram?: string;
}

export interface userUpdationBasicinfo {
  quote?: string;
  school?: string;
  job?: string;
  location?: string;
}

interface socialMediaLinks {
  facebook: string;
  instagram: string;
}

interface userSettings {
  storySettings: {
    visibleForFollowers: boolean;
    visibleForUserOnly: boolean;
  };

  postSettings: {
    unlisted: boolean;
    public: boolean;
    private: boolean;
  };

  notificationSettings: {
    onFollow: boolean;
    onMessage: boolean;
    onLike: boolean;
    onComment: boolean;
  };
}

export interface userSettingsUpdationProp {
  storySettings: {
    visibleForFollowers?: boolean;
    visibleForUserOnly?: boolean;
  };

  postSettings: {
    unlisted?: boolean;
    public?: boolean;
    private?: boolean;
  };

  notificationSettings: {
    onFollow?: boolean;
    onMessage?: boolean;
    onLike?: boolean;
    onComment?: boolean;
  };
}

export interface reqForSocialLinkUpdation extends Request {
  body: {
    facebook?: string;
    instagram?: string;
  };
}

export interface reqForBasicInfoUpdation extends Request {
  body: {
    quote?: string;
    school?: string;
    job?: string;
    location?: string;
  };
}

export interface reqForNotificationUpdation extends Request {
  body: userSettingsUpdationProp['notificationSettings'];
}

export interface updateSocialLinksJob {
  data: redisUserUpdationProp['socialMediaLinks'];
  userId: string;
}

export interface updateBasicinfoJob {
  data: redisUserUpdationProp['basicInfo'];
  userId: string;
}

export interface updateNotificationJob {
  data: userSettingsUpdationProp['notificationSettings'];
  userId: string;
}
