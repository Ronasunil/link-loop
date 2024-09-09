import { Middlewares } from '@global/helpers/middlewares';
import { Router as expressRouter } from 'express';
import { imageSchema } from '../schemas/imageSchema';
import { create } from '../controller/create';
import { destroy } from '../controller/destroy';
import { get } from '../controller/get';

class Router {
  private router = expressRouter();

  routes(): expressRouter {
    this.router.get('/image/profile', Middlewares.validateToken, Middlewares.currentUserCheck, get.proileImages);
    this.router.get('/image/background', Middlewares.validateToken, Middlewares.currentUserCheck, get.bgImages);
    this.router.get('/image/:imageId', Middlewares.validateToken, Middlewares.currentUserCheck, get.image);

    this.router.post(
      '/image/profileImage',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(imageSchema),
      create.profileImage
    );

    this.router.post(
      '/image/bgImage',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(imageSchema),
      create.bgImage
    );

    this.router.delete(
      '/image/profileImg/:imageId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      destroy.ProfileImg
    );

    this.router.delete(
      '/image/background/:imageId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      destroy.bgImg
    );

    return this.router;
  }
}

export const imageRouter = new Router();
