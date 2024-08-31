import { Response } from 'express';
import httpStatus from 'http-status-codes';
import { ReactionService } from '@services/db/reactionService';
import { reactionCache } from '@services/redis/reactionCache';
import { reqForGettingReactions } from '@reaction/interfaces/reactionInterface';
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
}

export const get = new Get();
