import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import requestIp from 'request-ip';

import { BadRequestError, NotFoundError } from '@global/helpers/errorHandler';
import { AuthService } from '@services/db/authService';
import { config } from '@utils/config';
import { PasswordChangedMailWorker } from '@workers/passwordChangedMailWorker';
import { ResetPasswordMailWorker } from '@workers/resetPasswordMailWorker';
import { format } from 'date-fns';
import { reqForPasswordUpdation } from '../interfaces/auth.interface';
import { userModel } from '@users/models/userModel';
import { authModel } from '../models/authModel';

interface bodyWithForgotPasswordProps extends Request {
  body: {
    email: string;
  };
}

interface bodyWithResetPasswordProps extends Request {
  body: {
    password: string;
    confirmPassword: string;
  };
}

class Password {
  async forgotPassword(req: bodyWithForgotPasswordProps, res: Response): Promise<void> {
    const { email } = req.body;

    const auth = await AuthService.getAuthByEmail(email);
    if (!auth) throw new BadRequestError('Please signup');

    // adding password token and its expiration
    const { token } = await AuthService.updatePasswordToken(auth._id);

    // sending mail
    new ResetPasswordMailWorker().prepareQueue(
      { subject: 'Action Required: Reset Your Password', to: auth.email, body: '' },
      { resetLink: `${config.CLIENT_URL}/resetToken/${token}`, username: auth.userName }
    );

    res.status(httpStatus.OK).json({ message: 'Email sent' });
  }

  async resetPassword(req: bodyWithResetPasswordProps, res: Response): Promise<void> {
    const { password } = req.body;
    const { resetToken } = req.params;
    const ipaddress = requestIp.getClientIp(req) || '';

    const auth = await AuthService.getAuthByResetToken(resetToken);
    if (!auth) throw new BadRequestError('Token expired');

    auth.set({ password, passwordResetExpires: undefined, passwordResetToken: undefined });
    await auth.save({ validateBeforeSave: true });

    res.status(httpStatus.OK).json({ message: 'Password successfully changed' });

    new PasswordChangedMailWorker().prepareQueue(
      { body: '', subject: 'Password Change Confirmation', to: auth.email },
      { ipaddress, date: format(new Date(), 'yyyy-MM-dd'), email: auth.email, username: auth.userName }
    );
  }

  async changePassword(req: reqForPasswordUpdation, res: Response) {
    const { confirmPassword, currentPassword } = req.body;

    const authId = req.currentUser!.authId;
    const auth = await authModel.findById(authId);
    if (!auth) throw new NotFoundError(`Auth regarding this id:${authModel} not found`);

    const isPasswordValid = await auth.comparePassword(currentPassword);
    if (!isPasswordValid) throw new BadRequestError('Invalid password');

    auth.set({ password: confirmPassword });

    await auth.save();

    res.status(httpStatus.OK).json({ message: 'Password changed' });
  }
}

export const password = new Password();
