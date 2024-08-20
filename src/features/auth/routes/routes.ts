import { Middlewares } from '@global/helpers/middlewares';
import express, { Request, Response, Router } from 'express';
import { authSchema } from '../schemas/authSchema';
import { Signup, signup } from '../controllers/signup';
import { login } from '../controllers/login';
import { curentUser } from '../controllers/currentUser';
import { signout } from '../controllers/signOut';
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
    return this.Router;
  }
}

export const authRoutes = new Routes();
