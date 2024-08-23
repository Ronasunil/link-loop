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
  passwordResetExpires?: Date | string;
  passwordResetToken?: string;
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
  passwordResetExpires: Date | string;
  passwordResetToken: string;
  avatarColor: string;
  avatarImage: string;
  comparePassword(password: string): Promise<Boolean>;
  hashPassword(password: string): Promise<string>;
}

export interface mailTo {
  from?: string;
  to: string;
  subject: string;
  body: string;
}

export interface mailOptions {
  from: string;
  to: string;
  html: string;
  subject: string;
}

export interface PasswordChangedTemplateData {
  username: string;
  email: string;
  date: string;
  ipaddress: string;
}

export interface forgotPasswordTemplateData {
  username: string;
  resetLink: string;
}

// export interface authInterface {
//   userName: string;
//   email: string;
//   password: string;
//   avatarColor: string;
//   avatarImage: string;
//   passwordResetExpires?: Date | string;
//   passwordResetToken?: string;
// }
