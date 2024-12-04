import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { PostService } from '@services/db/postService';
import { postCache } from '@services/redis/postCache';

import { Helpers } from '@global/helpers/helpers';
import {
  reqForGetAllPostsProps,
  reqForGetPostByAuthId,
  reqForGetPostById,
  reqForGetPostImgByAuthId,
} from '@post/interfaces/postInterfaces';

class Get {
  async posts(req: reqForGetAllPostsProps, res: Response) {
    const pageNo = Number.parseInt(req.query?.page || '1');
    const { skip, limit } = Helpers.paginate(pageNo);

    const cachePosts = await postCache.getAllPost(skip, limit);
    const posts = cachePosts.length ? cachePosts : await PostService.getAllPostsDb(skip, limit);

    res.status(httpStatus.OK).json({ posts });
  }

  async postsByAuthId(req: reqForGetPostByAuthId, res: Response) {
    const pageNo = Number.parseInt(req.query?.page || '1');
    const { skip, limit } = Helpers.paginate(pageNo);
    const { userId } = req.params;

    const cachePosts = await postCache.getPostsByUserId(userId, skip, limit);
    const posts = cachePosts.length ? cachePosts : await PostService.getPostbyAuthIdDb(userId, skip, limit);

    res.status(httpStatus.OK).json({ posts });
  }

  async postsWithImageByUserId(req: reqForGetPostImgByAuthId, res: Response) {
    const pageNo = Number.parseInt(req.query?.page || '1');
    const { skip, limit } = Helpers.paginate(pageNo);
    const { userId } = req.params;

    const cachePosts = await postCache.getPostImagesByUserId(userId, skip, limit);

    const posts = cachePosts.length ? cachePosts : await PostService.getPostImagesByAuthIdDb(userId, skip, limit);

    res.status(httpStatus.OK).json({ posts });
  }

  async postsWithVideosByUserId(req: Request, res: Response) {
    const { page } = req.query as { page: string };
    const { userId } = req.params as { userId: string };

    const pageNo = Number.parseInt(page || '1');
    const { skip, limit } = Helpers.paginate(pageNo);

    const chachePosts = await postCache.getPostVideosByUserId(userId, skip, limit);

    const posts = chachePosts.length ? chachePosts : await PostService.getPostVideoByAuthIdDb(userId, skip, limit);

    res.status(httpStatus.OK).json({ message: 'Post with videos', posts });
  }

  async postsWithId(req: reqForGetPostById, res: Response) {
    const { postId } = req.params;

    const cachePost = await postCache.getPost(postId);
    const post = cachePost ? cachePost : await PostService.getPostByIdDb(postId);

    res.status(httpStatus.OK).json({ post });
  }
}

export const get = new Get();
