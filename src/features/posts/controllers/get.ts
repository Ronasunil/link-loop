import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { PostService } from '@services/db/postService';
import { postCache } from '@services/redis/postCache';

import { Helpers } from '@global/helpers/helpers';

interface reqForGetAllPostsProps extends Request {
  query: {
    page?: string;
  };
}

interface reqForGetPostByAuthId extends Request {
  params: {
    authId: string;
  };

  query: {
    page?: string;
  };
}

interface reqForGetPostImgByAuthId extends Request {
  params: {
    authId: string;
  };

  query: {
    page?: string;
  };
}
interface reqForGetPostById extends Request {
  params: {
    postId: string;
  };
}

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

    const cachePosts = await postCache.getPostsByAuthId(authId);
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

  async postsWithId(req: reqForGetPostById, res: Response) {
    const { postId } = req.params;

    const cachePost = await postCache.getPost(postId);
    const post = cachePost ? cachePost : await PostService.getPostByIdDb(postId);

    res.status(httpStatus.OK).json({ post });
  }
}

export const get = new Get();
