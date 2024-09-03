import { commentAttrs, commentDoc, commentNamesList, commentUpdationProps } from '@comment/interfaces/commentInterface';
import { commentModel } from '@comment/models/commentModel';
import { NotFoundError } from '@global/helpers/errorHandler';
import { postModel } from '@post/models/postModel';
import mongoose from 'mongoose';

export class CommentService {
  static async addCommentDb(data: commentAttrs) {
    const { postId } = data;
    await commentModel.create(data);
    await postModel.findByIdAndUpdate(postId, { $inc: { totalComments: 1 } });
  }

  static async updateCommentDb(postId: string, data: commentUpdationProps) {
    await commentModel.findOneAndUpdate({ postId }, data);
  }

  static async deleteCommentDb(postId: string, commentId: string) {
    await commentModel.findOneAndDelete({ postId, _id: commentId });
    await postModel.findByIdAndUpdate(postId, { $inc: { totalComments: -1 } });
  }

  static async getCommentsOfPost(postId: string): Promise<commentDoc[]> {
    const comments = await commentModel.find({ postId });
    return comments;
  }

  static async getComment(postId: string, commentId: string): Promise<commentDoc> {
    const comment = await commentModel.findOne({ postId, _id: commentId });
    if (!comment) throw new NotFoundError(`Comment based on this id${commentId} is not found`);

    return comment;
  }

  static async getCommentsUserName(commentId: string): Promise<commentNamesList[]> {
    return await commentModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(commentId) },
      },
      { $group: { _id: null, names: { $addToSet: 'userName' }, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);
  }
}
