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
  bgImage: string;
  passwordResetExpires: Date | string;
  passwordResetToken: string;
  isBanned: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  userSettings: userSettings;
  socialMediaLinks: socialMediaLinks;
  profilePic: string;
  followersCount: number;
  followeeCount: number;
  bgImageVersion: string;
  bgImageId: string;
  blocked: string[];
  blockedBy: string[];
  totalPost: number;
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
  bgImage?: string;
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
  bgImageVersion?: string;
  bgImageId?: string;
  blocked?: string[];
  blockedBy?: string[];
  totalPost?: number;
}

export interface userAttrs {
  _id: string | mongoose.Types.ObjectId;
  authId: string | mongoose.Types.ObjectId;
  role?: string;
  name: string;
  dob?: Date | string;
  bgImage?: string;
  isBanned?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  userSettings?: userSettings;
  socialMediaLinks?: socialMediaLinks;
  profileImg: string;
  followersCount?: number;
  followeeCount?: number;
  totalPost?: number;
}

export interface userDoc extends mongoose.Document {
  authId: string | mongoose.Types.ObjectId;
  _id: string | mongoose.Types.ObjectId;
  role: string;
  name: string;
  userName?: string;
  uId?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  avatarImage?: string;
  dob: Date | string;
  bgImage: string;
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
