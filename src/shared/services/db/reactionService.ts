import { NotFoundError } from '@global/helpers/errorHandler';
import { notification } from '@notification/interfaces/notificationInterface';
import { notificationModel } from '@notification/model/notificationModel';
import { postModel } from '@post/models/postModel';
import { reactionAttrs, reactionDoc } from '@reaction/interfaces/reactionInterface';
import { reactionModel } from '@reaction/models/reactionModel';
import { userCache } from '@services/redis/userCache';
import { notificationSocket } from '@utils/features/sockets/notificationSocket';
import { redisUserAttrs } from '@utils/features/users/interface/user.interface';
import mongoose from 'mongoose';

export class ReactionService {
  static async addReactionDb(data: reactionAttrs) {
    const { postId, authId, reactionType, userFrom, userTo, userName } = data;
    const reaction = await reactionModel.findOne({ postId, authId });
    const user = await userCache.getUser(userTo);

    if (reaction) return this.updateReactionDb(reaction._id, data);
    await reactionModel.create(data);
    await postModel.findByIdAndUpdate(postId, { $inc: { totalReaction: 1, [`reactions.${reactionType}`]: 1 } });

    if (user && user.userSettings.notificationSettings.onLike && userTo !== userFrom) {
      // create notification
      const notification = new notificationModel();
      const notificationData = ReactionService.prototype.getNotificationData(user, reaction!, userName);
      await notification.insertNotification(notificationData);

      // emit socket notification
      notificationSocket.emit('added notification', notificationData, { userTo: userTo });
    }
  }

  private getNotificationData(user: redisUserAttrs, reaction: reactionDoc, userName: string): notification {
    return {
      comment: '',
      createdAt: new Date(),
      createdItemId: reaction._id.toString(),
      entityId: user._id.toString(),
      imageId: '',
      imageVersion: '',
      chat: '',
      message: `${userName} started following you`,
      notificationType: 'reaction',
      post: '',
      reaction: '',
      read: false,
      userFrom: reaction.userFrom,
      userTo: reaction.userTo,
    };
  }

  static async updateReactionDb(reactionId: string | mongoose.Types.ObjectId, data: reactionAttrs) {
    const { reactionType, postId, authId } = data;
    const reaction = (await reactionModel.findById(reactionId)) as reactionDoc;
    const prevReaction = reaction.reactionType;

    if (reactionType === prevReaction) {
      await reactionModel.findByIdAndDelete(reactionId);
      await postModel.findByIdAndUpdate(
        postId,
        { $inc: { totalReaction: -1, [`reactions.${reactionType}`]: -1 } },
        { new: true, runValidators: true }
      );
      return;
    }

    await reactionModel.findOneAndUpdate({ postId, authId }, { reactionType });
    await postModel.findByIdAndUpdate(postId, {
      $inc: { [`reactions.${reactionType}`]: 1, [`reactions.${prevReaction}`]: -1 },
    });
  }

  static async getReactionByPostId(postId: string, skip: number, limit: number) {
    const reactions = await reactionModel.find({ postId }).skip(skip).limit(limit);
    if (!reactions) throw new NotFoundError(`No reaction found`);
    return reactions;
  }
}
