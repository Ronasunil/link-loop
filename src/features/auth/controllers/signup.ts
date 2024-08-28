// Remote imports
import { cloudinaryUploader } from '@global/helpers/cloudinary';
import { BadRequestError } from '@global/helpers/errorHandler';
import { AuthService } from '@services/db/authService';
import { userCache } from '@services/redis/userCache';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status-codes';

// Local imports
import { authAttrs } from '../interfaces/auth.interface';
import { redisUserAttrs, userAttrs } from '@utils/features/users/interface/user.interface';

import { AuthWorker } from '@workers/authWorker';
import { SignupWorker } from '@workers/signupWorker';
import { Helpers } from '@global/helpers/helpers';

interface bodyWithAuthProps extends Request {
  body: {
    userName: string;
    email: string;
    password: string;
    avatarColor: string;
    avatarImage: string;
  };
}

export class Signup {
  public async createUser(req: bodyWithAuthProps, res: Response) {
    const { userName, email, password, avatarColor, avatarImage } = req.body;

    const user = await AuthService.getAuthByEmailOrUsername(userName, email);

    if (user) throw new BadRequestError('Use another email or username');

    const authId = Helpers.createObjectId();
    const userId = Helpers.createObjectId();

    const result = await cloudinaryUploader.imageUpload(avatarImage, `${userId}`, true, true);

    if (!result?.public_id) throw new BadRequestError('File upload: failed Try again.');

    const authObj: authAttrs = {
      _id: userId,
      userName,
      email,
      password,
      avatarColor,
      avatarImage,
      authId,
    };

    // saving to redis
    const userData = { ...Signup.prototype.redisUserData(authObj), avatarImage: `${result.url}` };
    await userCache.addUser(userData);

    // token generation and adding to session
    const token = AuthService.signToken({ userName, email, _id: userId, avatarImage, authId });

    req.session = { token };

    // saving to db
    new AuthWorker().saveToDb(Signup.prototype.authData(req, authId));
    new SignupWorker().saveToDb(Signup.prototype.userData(authId, userId, userName));

    res.status(httpStatus.CREATED).json({ message: 'success', user: userData });
  }

  private redisUserData(authObj: authAttrs): redisUserAttrs {
    const { userName, email, avatarColor, avatarImage, password, _id } = authObj;

    return {
      _id,
      userName,
      email,
      avatarColor,
      avatarImage,
      password,
      name: userName,
      userSettings: {
        notificationSettings: {
          onFollow: true,
          onLike: true,
          onMessage: true,
        },

        postSettings: {
          private: false,
          public: true,
          unlisted: false,
        },
        storySettings: {
          visibleForFollowers: false,
          visibleForUserOnly: true,
        },
      },
      isBanned: false,
      isDeleted: false,
      isVerified: false,
      role: 'user',

      passwordResetToken: '',
      passwordResetExpires: '',
      socialMediaLinks: {
        facebook: '',
        instagram: '',
      },
      bgImage: '',
      dob: '',
    };
  }

  private authData(data: bodyWithAuthProps, authId: mongoose.Types.ObjectId | string): authAttrs {
    const { userName, email, password, avatarColor, avatarImage } = data.body;
    return { userName, email, password, avatarColor, avatarImage, _id: authId.toString() };
  }

  private userData(
    authId: mongoose.Types.ObjectId | string,
    userId: mongoose.Types.ObjectId | string,
    name: string
  ): userAttrs {
    return { authId, _id: userId, name };
  }
}

export const signup = new Signup();
