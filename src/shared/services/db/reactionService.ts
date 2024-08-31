import { NotFoundError } from '@global/helpers/errorHandler';
import { postModel } from '@post/models/postModel';
import { reactionAttrs, reactionDoc } from '@reaction/interfaces/reactionInterface';
import { reactionModel } from '@reaction/models/reactionModel';
import mongoose from 'mongoose';

export class ReactionService {
  static async addReactionDb(data: reactionAttrs) {
    const { postId, authId, reactionType } = data;
    const reaction = await reactionModel.findOne({ postId, authId });

    if (reaction) return this.updateReactionDb(reaction._id, data);
    await reactionModel.create(data);
    await postModel.findByIdAndUpdate(postId, { $inc: { totalReaction: 1, [`reactions.${reactionType}`]: 1 } });
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
