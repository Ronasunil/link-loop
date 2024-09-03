import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { commentCache } from '@services/redis/commentCache';
import { CommentWorker } from '@workers/commentWorker';
import { commentParam } from '@comment/interfaces/commentInterface';

class Destory {
  async comment(req: Request, res: Response) {
    const { commentId, postId } = req.params as unknown as commentParam;

    await commentCache.deleteComment(postId, commentId);
    const commentWorker = await new CommentWorker().prepareQueueForDeletion({ postId, commentId });
    commentWorker.deleteComment();

    res.status(httpStatus.NO_CONTENT).json({ message: 'Deleted successfully' });
  }
}

export const destroy = new Destory();
