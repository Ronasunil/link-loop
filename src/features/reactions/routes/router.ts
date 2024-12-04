import { Middlewares } from '@global/helpers/middlewares';
import { reaction } from '@reaction/controllers/create';
import { get } from '@reaction/controllers/get';
import { addReactionSchema } from '@reaction/schemas/reactionSchema';

import { Router as expressRouter } from 'express';

class Router {
  private router = expressRouter();
  routes(): expressRouter {
    this.router.get('/post/reactions/:postId', Middlewares.validateToken, Middlewares.currentUserCheck, get.reaction);
    this.router.get(
      '/post/reactions/:postId/:userId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.checkReactionExist
    );
    this.router.post(
      '/posts/reaction',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(addReactionSchema),
      reaction.create
    );

    return this.router;
  }
}

export const reactionRouter = new Router();
