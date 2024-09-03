import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { commentParam, reqForGettingComment, reqForGettingPostComments } from '@comment/interfaces/commentInterface';
import { CommentService } from '@services/db/commentService';
import { commentCache } from '@services/redis/commentCache';

class Get {
  async allCommentsOfPost(req: reqForGettingPostComments, res: Response) {
    const { postId } = req.params as { postId: string };
    const commentsCache = await commentCache.getPostComments(postId);

    const comments = commentsCache.length ? commentsCache : await CommentService.getCommentsOfPost(postId);

    res.status(httpStatus.OK).json({ comments, totalComments: comments.length });
  }

  async comment(req: Request, res: Response) {
    const { postId, commentId } = req.params as unknown as commentParam;
    const commentsCache = await commentCache.getComment(postId, commentId);

    const comment = commentsCache ? commentsCache : await CommentService.getComment(postId, commentId);

    res.status(httpStatus.OK).json({ comment });
  }

  async commentsUserName(req: reqForGettingPostComments, res: Response) {
    const { postId } = req.params as { postId: string };
    const commentsCache = await commentCache.getPostCommentNames(postId);

    const comments = commentsCache ? commentsCache : await CommentService.getCommentsUserName(postId);

    res.status(httpStatus.OK).json({ comments });
  }
}

export const get = new Get();
