import { Response } from 'express';
import mongoose from 'mongoose';

import httpStatus from 'http-status-codes';

import { Helpers } from '@global/helpers/helpers';
import { reactionAttrs, reqForAddReactions } from '@reaction/interfaces/reactionInterface';
import { reactionCache } from '@services/redis/reactionCache';
import { ReactionWorker } from '@workers/reactionWorker';
import { postSocketIo } from '@utils/features/sockets/postSocket';

class Reaction {
  async create(req: reqForAddReactions, res: Response) {
    const reactionId = Helpers.createObjectId();
    const data = Reaction.prototype.getReactionData(req, reactionId);

    postSocketIo.emit('reaction', data);
    await reactionCache.createReaction(data);
    const reactionWorker = await new ReactionWorker().prepareQueue(data);
    reactionWorker.createReaction();

    res.status(httpStatus.OK).json({ message: 'Reaction successfully added', status: '0K' });
  }

  private getReactionData(req: reqForAddReactions, _id: string | mongoose.Types.ObjectId): reactionAttrs {
    const { postId, profilePic, reactionType, userName, userTo } = req.body;
    const userId = req.currentUser!._id;
    const userFrom = req.currentUser!._id;

    return { postId, profilePic, reactionType, userName, _id, createdAt: new Date(), userId, userFrom, userTo };
  }
}

export const reaction = new Reaction();
