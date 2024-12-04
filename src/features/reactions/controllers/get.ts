import { Response } from 'express';
import httpStatus from 'http-status-codes';
import { ReactionService } from '@services/db/reactionService';
import { reactionCache } from '@services/redis/reactionCache';
import { reqForCheckingReactionsExist, reqForGettingReactions } from '@reaction/interfaces/reactionInterface';
import { Helpers } from '@global/helpers/helpers';

class Get {
  async reaction(req: reqForGettingReactions, res: Response) {
    const { postId } = req.params;
    const pageNo = Number.parseInt(req.query?.page || '1');
    const { limit, skip } = Helpers.paginate(pageNo);

    const reactionDataCache = await reactionCache.getReactionByPostId(postId, skip, limit);

    const reactions = reactionDataCache.length
      ? reactionDataCache
      : await ReactionService.getReactionByPostId(postId, skip, limit);

    res.status(httpStatus.OK).json({ reactions });
  }

  async checkReactionExist(req: reqForCheckingReactionsExist, res: Response) {
    const { userId, postId } = req.params;

    const reactionDataCache = await reactionCache.getReaction(postId, userId);
    const reaction = reactionCache ? reactionDataCache : await ReactionService.checkReactionExist(postId, userId);

    res.status(httpStatus.OK).json({ reaction });
  }
}

export const get = new Get();
