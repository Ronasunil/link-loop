import { follow } from '@follower/controllers/create';
import { destroy } from '@follower/controllers/destroy';
import { get } from '@follower/controllers/get';
import { userBlockManager } from '@follower/controllers/userBlockManager';
import { Middlewares } from '@global/helpers/middlewares';
import { Router as expressRouter } from 'express';

class Router {
  private router = expressRouter();

  routes(): expressRouter {
    this.router.patch(
      '/users/follow/:followerId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      follow.followuser
    );

    this.router.patch(
      '/users/block/:blockUserId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      userBlockManager.block
    );

    this.router.patch(
      '/users/unblock/:unblockUserId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      userBlockManager.unblock
    );

    this.router.delete(
      '/users/unfollow/:followerId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      destroy.follow
    );

    this.router.get(
      '/users/followers/:userId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.userFollowers
    );

    this.router.get(
      '/users/followees/:userId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.userFollowees
    );

    this.router.get(
      '/users/:userId/followee/:checkingUserId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.checkUserFollows
    );

    return this.router;
  }
}

export const followerRouter = new Router();
