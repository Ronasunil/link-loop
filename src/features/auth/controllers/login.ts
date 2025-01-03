import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { NotAuthorizedError } from '@global/helpers/errorHandler';
import { AuthService } from '@services/db/authService';
import { authDoc, authPayload } from '../interfaces/auth.interface';
import { userDoc } from '@utils/features/users/interface/user.interface';

interface bodyWithLoginProps extends Request {
  body: {
    email?: string;
    username?: string;
    password: string;
  };
}

class Login {
  async authenticate(req: bodyWithLoginProps, res: Response) {
    const { password, email, username } = req.body;

    // get auth and validating existence
    const auth = await AuthService.getAuthByEmailOrUsername(username || '', email || '');
    if (!auth) throw new NotAuthorizedError('Invalid credentials');

    // get user and validating existence
    const user = await AuthService.getUserByAuthId(auth._id);
    if (!user) return new NotAuthorizedError('Invalid credentials');

    // validating  password
    const isPasswordValid = await auth.comparePassword(password);
    if (!isPasswordValid) throw new NotAuthorizedError('Invalid credentials');

    // assigning cookie
    const token = AuthService.signToken(Login.prototype.getTokenPaylod(auth, user));
    req.session = { token };

    res.status(httpStatus.OK).json({ message: 'Login successfull', user, token });
  }

  private getTokenPaylod(data: authDoc, userData: userDoc): authPayload {
    const { userName, email, _id, avatarColor } = data;

    return { userName, email, _id: userData._id, avatarColor, authId: _id };
  }
}

export const login = new Login();
