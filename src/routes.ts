import { Application } from 'express';
import { authRoutes } from './features/auth/routes/routes';
import { postRoutes } from '@post/routes/router';

export const routes = function (app: Application) {
  const baseURL = '/api/v1';
  app.use(`${baseURL}`, authRoutes.routes());
  app.use(`${baseURL}`, postRoutes.routes());
};
