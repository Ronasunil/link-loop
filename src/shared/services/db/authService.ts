import jwt from 'jsonwebtoken';
import { authDoc, authPayload } from '@utils/features/auth/interfaces/auth.interface';
import { authModel } from '@utils/features/auth/models/authModel';
import { config } from '@utils/config';
import { userDoc } from '@utils/features/users/interface/user.interface';
import { userModel } from '@utils/features/users/models/userModel';
import mongoose from 'mongoose';

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
    const { _id, userName, avatarImage, email } = authData;

    return jwt.sign({ _id, userName, avatarImage, email }, config.JWT_SECRET!);
  }
}
