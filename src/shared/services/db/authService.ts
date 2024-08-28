import jwt from 'jsonwebtoken';

import crypto from 'crypto';

import { authDoc, authPayload } from '@utils/features/auth/interfaces/auth.interface';
import { authModel } from '@utils/features/auth/models/authModel';
import { config } from '@utils/config';
import { userDoc } from '@utils/features/users/interface/user.interface';
import { userModel } from '@utils/features/users/models/userModel';
import mongoose from 'mongoose';
import { Helpers } from '@global/helpers/helpers';

export class AuthService {
  static async getAuthByEmailOrUsername(userName: string, email: string): Promise<authDoc | null> {
    const user = await authModel.findOne({ $or: [{ userName }, { email }] });

    return user;
  }

  static async getAuthbyId(id: string): Promise<authDoc | null> {
    return await authModel.findById(id);
  }

  static async getUserByAuthId(id: string | mongoose.Types.ObjectId): Promise<userDoc | null> {
    return await userModel.findOne({ authId: id });
  }

  static async getUserByid(id: string): Promise<userDoc | null> {
    return await userModel.findById(id).populate('authId');
  }

  static signToken(authData: authPayload): string {
    const { _id, userName, avatarImage, email, authId } = authData;

    return jwt.sign({ _id, userName, avatarImage, email, authId }, config.JWT_SECRET!);
  }

  static async getAuthByEmail(email: string): Promise<authDoc | null> {
    return await authModel.findOne({ email });
  }

  static async updatePasswordToken(id: string | mongoose.Types.ObjectId) {
    const token = crypto.randomBytes(10).toString('hex');

    await authModel.findByIdAndUpdate(
      id,
      { passwordResetToken: token, passwordResetExpires: Helpers.thirtyMinAddedTime() },
      { new: true, runValidators: true }
    );

    return { token };
  }

  static async getAuthByResetToken(resetToken: string): Promise<authDoc | null> {
    return await authModel.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: new Date().toUTCString() },
    });
  }
}
