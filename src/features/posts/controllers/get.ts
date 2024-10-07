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
import { cache } from 'joi';

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
    const { authId } = req.params;

    const cachePosts = await postCache.getPostsByAuthId(authId, skip, limit);
    console.log(cachePosts, 'pop', authId);
    const posts = cachePosts.length ? cachePosts : await PostService.getPostbyAuthIdDb(authId, skip, limit);

    res.status(httpStatus.OK).json({ posts });
  }

  async postsWithImageByAuthId(req: reqForGetPostImgByAuthId, res: Response) {
    const pageNo = Number.parseInt(req.query?.page || '1');
    const { skip, limit } = Helpers.paginate(pageNo);
    const { authId } = req.params;

    const cachePosts = await postCache.getPostImagesByAuthId(authId, skip, limit);

    const posts = cachePosts.length ? cachePosts : await PostService.getPostImagesByAuthIdDb(authId, skip, limit);

    res.status(httpStatus.OK).json({ posts });
  }

  async postsWithVideosByAuthId(req: Request, res: Response) {
    const { page } = req.query as { page: string };
    const { authId } = req.params as { authId: string };

    const pageNo = Number.parseInt(page || '1');
    const { skip, limit } = Helpers.paginate(pageNo);

    const chachePosts = await postCache.getPostVideosByAuthId(authId, skip, limit);

    const posts = chachePosts.length ? chachePosts : await PostService.getPostVideoByAuthIdDb(authId, skip, limit);

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
