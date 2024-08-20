import express, { Application } from 'express';
import { authRoutes } from './features/auth/routes/routes';

export const routes = function (app: Application) {
  const baseURL = '/api/v1';
  app.use(`${baseURL}`, authRoutes.routes());
};
