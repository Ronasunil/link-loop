import { commentAttrs, commentDoc, commentNamesList, commentUpdationProps } from '@comment/interfaces/commentInterface';
import { commentModel } from '@comment/models/commentModel';
import { NotFoundError } from '@global/helpers/errorHandler';
import { postDoc } from '@post/interfaces/postInterfaces';
import { postModel } from '@post/models/postModel';
import { userCache } from '@services/redis/userCache';
import { notification } from '@utils/features/notification/interfaces/notificationInterface';
import { notificationModel } from '@utils/features/notification/model/notificationModel';
import { notificationSocket } from '@utils/features/sockets/notificationSocket';
import mongoose from 'mongoose';

export class CommentService {
  static async addCommentDb(data: commentAttrs) {
    const { postId } = data;
    const comment = await commentModel.create(data);
    const post = await postModel.findByIdAndUpdate(
      postId,
      { $inc: { totalComments: 1 } },
      { new: true, runValidators: true }
    );

    const user = await userCache.getUser(comment.userTo);

    if (user.userSettings.notificationSettings.onComment && comment.userFrom !== comment.userTo && post) {
      // create notification
      const notification = new notificationModel();
      const notificationData = CommentService.prototype.getNotificationData(post, comment, user.userName);
      await notification.insertNotification(notificationData);

      // emit socket notification
      notificationSocket.emit('added notification', notificationData, { userTo: comment.userTo });
    }
  }

  private getNotificationData(post: postDoc, comment: commentDoc, userName: string): notification {
    return {
      comment: JSON.stringify(comment),
      createdAt: new Date(),
      createdItemId: comment._id.toString(),
      entityId: comment._id.toString(),
      imageId: post.imageId,
      imageVersion: post.imageVersion,
      message: `${userName} commented on this post`,
      notificationType: 'comment',
      post: JSON.stringify(post),
      reaction: '',
      read: false,
      userFrom: comment.userFrom.toString(),
      userTo: comment.userTo.toString(),
    };
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
