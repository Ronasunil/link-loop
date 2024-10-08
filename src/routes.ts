import { Application } from 'express';
import { authRoutes } from './features/auth/routes/routes';
import { postRoutes } from '@post/routes/router';
import { reactionRouter } from '@reaction/routes/router';
import { commentRouter } from '@comment/routes/router';
import { followerRouter } from '@follower/routes/router';
import { notificationRouter } from '@notification/routes/router';
import { imageRouter } from './features/image/routes/router';
import { chatRouter } from '@chat/routes/route';
import { userRouter } from '@users/routes/router';
import { healthRouter } from '@health/routes/router';

export const routes = function (app: Application) {
  const baseURL = '/api/v1';
  app.use('', healthRouter.routes());
  app.use(`${baseURL}`, authRoutes.routes());
  app.use(`${baseURL}`, postRoutes.routes());
  app.use(`${baseURL}`, reactionRouter.routes());
  app.use(`${baseURL}`, commentRouter.routes());
  app.use(`${baseURL}`, followerRouter.routes());
  app.use(`${baseURL}`, notificationRouter.routes());
  app.use(`${baseURL}`, imageRouter.routes());
  app.use(`${baseURL}`, chatRouter.routes());
  app.use(`${baseURL}`, userRouter.routes());
};
