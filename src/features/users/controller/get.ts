import httpStatus from 'http-status-codes';

import { Helpers } from '@global/helpers/helpers';
import { FollowerService } from '@services/db/followerService';
import { UserService } from '@services/db/userService';
import { followerCache } from '@services/redis/followerCache';
import { userCache } from '@services/redis/userCache';
import { Request, Response } from 'express';
import { postCache } from '@services/redis/postCache';
import { PostService } from '@services/db/postService';

class Get {
  async getUsers(req: Request, res: Response) {
    const { page } = req.query as { page: string };
    const pageNo = +page || 1;
    const userId = req.currentUser!._id.toString();

    const { skip, limit } = Helpers.paginate(pageNo);

    const totalUsersCache = await userCache.getAllusers(userId, skip, limit);
    const followersCache = await followerCache.getFollowers(userId);
    const totalUsersCountCache = await userCache.getTotalUser();

    const totalUsers = totalUsersCache.length ? totalUsersCache : await UserService.getAllUsers(userId, skip, limit);
    const followers = followersCache.length ? followersCache : await FollowerService.getFollowers(userId);
    const totalUsersCount = totalUsersCountCache ? totalUsersCountCache : await UserService.getTotalUsersCount();

    res
      .status(httpStatus.OK)
      .json({ message: 'Total users', users: totalUsers, followers, totalUsers: totalUsersCount });
  }

  async searchUsers(req: Request, res: Response) {
    const { query } = req.query as { query: string };

    const result = await UserService.searchUsers(query);

    res.status(httpStatus.OK).json({ message: 'Searched users', users: result });
  }

  async getUserProfileAndPost(req: Request, res: Response) {
    const { authId, userId } = req.params as { authId: string; userId: string };
    const { page } = req.query as { page: string };
    const pageNo = +page || 1;
    const { limit, skip } = Helpers.paginate(pageNo);

    const { posts: cachePosts, user: cacheUser } = await userCache.getUserProfileAndPost(userId, authId, skip, limit);

    const posts = cachePosts.length ? cachePosts : await PostService.getPostbyAuthIdDb(authId, skip, limit);
    const user = cacheUser ? cacheUser : await UserService.getUser(userId);

    res.status(httpStatus.OK).json({ message: 'User with posts', user, posts });
  }

  async getRandomUsers(req: Request, res: Response) {
    const page = req.query as { page: string };
    const pageNo = +page || 1;
    const { skip, limit } = Helpers.paginate(pageNo);

    const userId = req.currentUser!._id.toString();

    const randomUsersCache = await userCache.getRandomUserSuggestion(userId, skip, limit);

    const randomUsers = randomUsersCache.length
      ? randomUsersCache
      : await UserService.getRandomUserSuggestionDb(userId, skip, limit);

    res.status(httpStatus.OK).json({ message: 'Random users', users: randomUsers });
  }
}

export const get = new Get();
