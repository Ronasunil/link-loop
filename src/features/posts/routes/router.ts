import { Middlewares } from '@global/helpers/middlewares';
import { Router as expressRouter } from 'express';
import { post } from '../controllers/postCreate';
import { postSchema, postUpdationSchema, postWithImageSchema } from '@post/schemas/postSchema';
import { get } from '@post/controllers/get';
import { update } from '@post/controllers/update';
import { destory } from '@post/controllers/destroy';

class Router {
  private router: expressRouter;
  constructor() {
    this.router = expressRouter();
  }

  routes(): expressRouter {
    this.router.post(
      '/post',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(postSchema),
      post.create
    );
    this.router.post(
      '/post/image',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(postWithImageSchema),
      post.createWithImage
    );

    this.router.get('/posts', Middlewares.validateToken, Middlewares.currentUserCheck, get.posts);
    this.router.get('/posts/auth/:authId', Middlewares.validateToken, Middlewares.currentUserCheck, get.postsByAuthId);
    this.router.get(
      '/posts/:authId/image',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.postsWithImageByAuthId
    );
    this.router.get('/posts/:postId', Middlewares.validateToken, Middlewares.currentUserCheck, get.postsWithId);

    this.router.patch(
      '/posts/:postId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(postUpdationSchema),
      update.post
    );

    this.router.delete('/posts/:postId', Middlewares.validateToken, Middlewares.currentUserCheck, destory.post);

    return this.router;
  }
}

export const postRoutes = new Router();
