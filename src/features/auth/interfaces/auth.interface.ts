import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      currentUser?: authPayload;
      session: { token?: string } | null;
    }
  }
}

export interface authAttrs {
  _id: string | mongoose.Types.ObjectId;
  userName: string;
  authId?: string | mongoose.Types.ObjectId;
  email: string;
  password: string;
  avatarColor: string;
  avatarImage: string;
}

export interface authPayload {
  _id: string | mongoose.Types.ObjectId;
  userName: string;
  email: string;
  avatarImage: string;
}

export interface authDoc extends mongoose.Document {
  _id: string | mongoose.Types.ObjectId;
  userName: string;
  email: string;
  password: string;
  avatarColor: string;
  avatarImage: string;
  comparePassword(password: string): Promise<Boolean>;
  hashPassword(password: string): Promise<string>;
}

export interface authInterface {
  userName: string;
  uId: string;
  email: string;
  password: string;
  avatarColor: string;
  avatarImage: string;
}
