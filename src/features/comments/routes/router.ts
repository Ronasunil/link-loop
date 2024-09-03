import { comment } from '@comment/controllers/create';
import { destroy } from '@comment/controllers/destroy';
import { get } from '@comment/controllers/get';
import { update } from '@comment/controllers/update';
import { commentSchema, commentUpdationSchema } from '@comment/schemas/commentSchema';
import { Middlewares } from '@global/helpers/middlewares';

import { Router as expressRouter } from 'express';
class Router {
  private router = expressRouter();

  routes(): expressRouter {
    this.router.patch(
      '/posts/:postId/comments/:commentId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(commentUpdationSchema),
      update.comment
    );
    this.router.post(
      '/posts/comment',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(commentSchema),
      comment.create
    );

    this.router.get(
      '/posts/:postId/comment/:commentId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.comment
    );

    this.router.get(
      '/posts/comment/:postId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.allCommentsOfPost
    );
    this.router.get(
      '/posts/comment/username/:postId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.commentsUserName
    );

    this.router.delete(
      '/posts/:postId/comments/:commentId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      destroy.comment
    );

    return this.router;
  }
}

export const commentRouter = new Router();
