import { Middlewares } from '@global/helpers/middlewares';
import { get } from '@notification/controller/get';
import { update } from '@notification/controller/update';
import { Router as expressRouter } from 'express';

class Router {
  private router = expressRouter();

  routes(): expressRouter {
    this.router.get('/notifications', Middlewares.validateToken, Middlewares.currentUserCheck, get.notification);
    this.router.patch(
      '/notifications/:notificationId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      update.notification
    );

    return this.router;
  }
}

export const notificationRouter = new Router();
