import { Router as expressRouter } from 'express';
import { get } from '@health/controllers/get';

class Router {
  private router: expressRouter;

  constructor() {
    this.router = expressRouter();
  }
  routes(): expressRouter {
    this.router.get('/health', get.health);
    this.router.get('/env', get.env);
    this.router.get('/fib/:num', get.fib);

    return this.router;
  }
}

export const healthRouter = new Router();
