import { Router as expressRouter } from 'express';

import { get } from '@users/controller/get';
import { Middlewares } from '@global/helpers/middlewares';
import { update } from '@users/controller/update';
import { basicInfoSchema, notificationSchema, socialMediaSchema } from '@users/schemas/userUpdationSchema';

class Router {
  private router: expressRouter = expressRouter();

  routes(): expressRouter {
    // here to work properly page query is needed
    this.router.get('/users', Middlewares.validateToken, Middlewares.currentUserCheck, get.getUsers);
    // here to work properly search query is needed
    this.router.get('/users/search', Middlewares.validateToken, Middlewares.currentUserCheck, get.searchUsers);

    this.router.get('/users/random', Middlewares.validateToken, Middlewares.currentUserCheck, get.getRandomUsers);

    this.router.get(
      '/users/:userId/posts/:authId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.getUserProfileAndPost
    );

    this.router.patch(
      '/users/me/notification',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(notificationSchema),
      update.notification
    );

    this.router.patch(
      '/users/me/socialLinks',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(socialMediaSchema),
      update.socialLinks
    );

    this.router.patch(
      '/users/me/basicInfo',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(basicInfoSchema),
      update.basicInfo
    );
    return this.router;
  }
}

export const userRouter = new Router();
