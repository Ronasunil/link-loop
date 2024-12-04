import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { postCache } from '@services/redis/postCache';
import { PostWorker } from '@workers/postWorker';
import { BadRequestError } from '@global/helpers/errorHandler';
import { PostService } from '@services/db/postService';
import { postSocketIo } from '@utils/features/sockets/postSocket';

interface reqForPostDel extends Request {
  params: {
    postId: string;
  };
}

class Destroy {
  async post(req: reqForPostDel, res: Response) {
    console.log('inside delete');
    const { postId } = req.params;
    const authId = req.currentUser?.authId.toString() || '';
    const userPostsCache = await postCache.getUsersPost(authId);
    const userPosts = userPostsCache.length ? userPostsCache : await PostService.getUserPostsDb(authId);

    if (!userPosts.includes(`post:${postId}`)) throw new BadRequestError('Something went wrong');
    postSocketIo.emit('delete post', postId);
    await postCache.deletePost(postId, authId);
    const postWorker = await new PostWorker().prepareQueueForDeletion(postId);
    postWorker.deletePost();

    res.status(httpStatus.NO_CONTENT).json({});
  }
}

export const destory = new Destroy();
