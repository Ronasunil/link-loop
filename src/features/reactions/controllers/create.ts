import { Request, Response } from 'express';
import mongoose from 'mongoose';

import httpStatus from 'http-status-codes';

import { Helpers } from '@global/helpers/helpers';
import { reactionAttrs, reqForAddReactions } from '@reaction/interfaces/reactionInterface';
import { reactionCache } from '@services/redis/reactionCache';
import { ReactionWorker } from '@workers/reactionWorker';

class Reaction {
  async create(req: reqForAddReactions, res: Response) {
    const reactionId = Helpers.createObjectId();
    const data = Reaction.prototype.getReactionData(req, reactionId);

    await reactionCache.createReaction(data);
    const reactionWorker = await new ReactionWorker().prepareQueue(data);
    reactionWorker.createReaction();

    res.status(httpStatus.OK).json({ message: 'Reaction successfully added', status: '0K' });
  }

  private getReactionData(req: reqForAddReactions, _id: string | mongoose.Types.ObjectId): reactionAttrs {
    const { postId, profilePic, reactionType, userName } = req.body;
    const authId = req.currentUser!.authId;

    return { postId, profilePic, reactionType, userName, _id, createdAt: new Date(), authId };
  }
}

export const reaction = new Reaction();
