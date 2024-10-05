import { Middlewares } from '@global/helpers/middlewares';
import express, { Request, Response, Router } from 'express';
import { authSchema } from '../schemas/authSchema';
import { Signup, signup } from '../controllers/signup';
import { login } from '../controllers/login';
import { curentUser } from '../controllers/currentUser';
import { signout } from '../controllers/signOut';
import { password } from '../controllers/password';
import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema';
import { resetPasswordSchema } from '../schemas/resetPasswordSchema';
import { passwordUpdationSchema } from '../schemas/updationSchema';
class Routes {
  private Router: Router;
  constructor() {
    this.Router = Router();
  }

  public routes(): Router {
    this.Router.post('/signup', Middlewares.joiValidation(authSchema), signup.createUser);
    this.Router.post('/login', login.authenticate);
    this.Router.get('/currentUser', Middlewares.validateToken, Middlewares.currentUserCheck, curentUser.get);
    this.Router.delete('/signout', signout.delete);
    this.Router.post(
      '/forgotPassword',
      // Middlewares.validateToken,
      // Middlewares.currentUserCheck,
      Middlewares.joiValidation(forgotPasswordSchema),
      password.forgotPassword
    );
    this.Router.post(
      '/resetPassword/:resetToken',
      // Middlewares.validateToken,
      // Middlewares.currentUserCheck,
      Middlewares.joiValidation(resetPasswordSchema),
      password.resetPassword
    );

    this.Router.patch(
      '/auth/password',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(passwordUpdationSchema),
      password.changePassword
    );
    return this.Router;
  }
}

export const authRoutes = new Routes();
