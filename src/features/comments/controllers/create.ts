import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { commentAttrs, reqForCommentCreation } from '@comment/interfaces/commentInterface';
import { Helpers } from '@global/helpers/helpers';

import { commentCache } from '@services/redis/commentCache';
import { CommentWorker } from '@workers/commentWorker';
import { postSocketIo } from '@utils/features/sockets/postSocket';

class Comment {
  async create(req: reqForCommentCreation, res: Response) {
    const commentId = Helpers.createObjectId();
    const commentData = Comment.prototype.commentData(req, commentId);

    postSocketIo.emit('comment:created', commentData);
    await commentCache.addComment(commentData);

    const commentWorker = await new CommentWorker().prepareQueueForCreation(commentData);
    commentWorker.createComment();

    res.status(httpStatus.OK).json({ message: 'Comment created successfully', comment: commentData });
  }

  private commentData(req: reqForCommentCreation, commentId: string | mongoose.Types.ObjectId): commentAttrs {
    const { userTo, postId, comment, profilePic } = req.body;

    return {
      userTo,
      authId: req.currentUser!.authId.toString(),
      postId,
      comment,
      _id: commentId,
      createdAt: new Date(),
      userName: req.currentUser!.userName,
      profilePic,
      userFrom: req.currentUser!._id.toString(),
    };
  }
}

export const comment = new Comment();
