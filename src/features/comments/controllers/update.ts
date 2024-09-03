import { Response } from 'express';
import httpStatus from 'http-status-codes';

import { commentParam, reqForCommentUpdation } from '@comment/interfaces/commentInterface';
import { commentCache } from '@services/redis/commentCache';
import { CommentWorker } from '@workers/commentWorker';

class Update {
  async comment(req: reqForCommentUpdation, res: Response) {
    const { commentId, postId } = req.params as unknown as commentParam;
    const { comment } = req.body;

    await commentCache.updateComment(postId.toString(), commentId.toString(), { comment });
    const commentWorker = await new CommentWorker().prepareQueueForUpdation({ comment });
    commentWorker.updateComment(postId);

    res.status(httpStatus.OK).json({ message: 'Comment updated successfully' });
  }
}

export const update = new Update();
