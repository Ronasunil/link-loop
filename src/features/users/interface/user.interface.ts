import mongoose from 'mongoose';

export interface redisUserAttrs {
  _id: string | mongoose.Types.ObjectId;
  role: string;
  name: string;
  userName: string;
  email: string;
  password: string;
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
  password?: string;
  avatarColor?: string;
  avatarImage?: string;
  dob?: Date | string;
  bgImg?: string;
  passwordResetExpires?: Date | string;
  passwordResetToken?: string;
  isBanned?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  userSettings?: userSettings;
  socialMediaLinks?: socialMediaLinks;
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
  userName: string;
  userSettings: userSettings;
  socialMediaLinks: socialMediaLinks;
  profileImg: string;
  followersCount: number;
  followeeCount: number;
  bgImg: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  totalPost: number;
}

interface socialMediaLinks {
  facebook: String;
  instagram: String;
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
