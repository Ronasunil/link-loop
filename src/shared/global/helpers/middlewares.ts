import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { JoiValidationFailed, NotAuthorizedError } from './errorHandler';
import jwt from 'jsonwebtoken';
import { config } from '@utils/config';
import { authPayload } from '@utils/features/auth/interfaces/auth.interface';

export class Middlewares {
  static joiValidation(schema: Schema) {
    return function (req: Request, res: Response, next: NextFunction) {
      const { error } = schema.validate(req.body);

      if (!error) return next();

      throw new JoiValidationFailed(error);
    };
  }

  static async validateToken(req: Request, res: Response, next: NextFunction) {
    if (!req?.session?.token) throw new NotAuthorizedError('Token not exist');

    try {
      const payload = jwt.verify(req.session.token, config.JWT_SECRET!) as authPayload;
      req.currentUser = payload;

      next();
    } catch (err) {
      throw new NotAuthorizedError('Token not exist');
    }
  }

  static currentUserCheck(req: Request, res: Response, next: NextFunction) {
    if (!req.currentUser) throw new Error('Unauthorized access');

    next();
  }
}
