import { reactionAttrs, reactions, reactionType } from '@reaction/interfaces/reactionInterface';
import { BaseCache } from './baseCache';

import { postCache } from './postCache';
import { NotFoundError } from '@global/helpers/errorHandler';
import { postAttrs } from '@post/interfaces/postInterfaces';

export class ReactionCache extends BaseCache {
  constructor() {
    super();
  }

  async getReaction(postId: string, userId: string): Promise<reactionAttrs | null> {
    const result = await this.client.hget(`reaction:${postId}`, userId);
    return result ? JSON.parse(result) : result;
  }

  async getReactionByPostId(postId: string, skip: number, limit: number): Promise<reactionAttrs[]> {
    const reactions: reactionAttrs[] = [];
    let cursor = '0';

    do {
      const [newCursor, items] = await this.client.hscan(`reaction:${postId}`, cursor);
      cursor = newCursor;

      for (let i = 0; i < items.length; i += 2) {
        if (skip > 0) {
          skip--;
          continue;
        }

        if (reactions.length < limit) {
          const value = JSON.parse(items[i + 1]) as reactionAttrs;
          reactions.push(value);
        } else return reactions;
      }
    } while (cursor !== '0');

    return reactions;
  }

  async createReaction(data: reactionAttrs): Promise<void> {
    const { postId, userId } = data;

    // check if updating the reaction
    const status = await this.updateReaction(data);
    if (status) return;

    // check if its creating (it will create new reaction if no prev reaction exist)
    const reactionJson = JSON.stringify(data);
    await this.client.hset(`reaction:${postId}`, userId.toString(), reactionJson);

    await this.updatePostBasedonReaction(data, 'inc');
  }

  async updateReaction(data: reactionAttrs): Promise<boolean> {
    const { postId, userId } = data;

    // check if reaction exist
    const reaction = await this.getReaction(postId.toString(), userId.toString());
    if (!reaction) return false;

    // reaction exist

    // deleting when user has selected same reaction twice
    if (reaction.reactionType === data.reactionType) {
      await this.deleteReaction(data);
      this.updatePostBasedonReaction(data, 'dec');
      return true;
    }

    // updating existing reaction
    const updatedReactionJson = JSON.stringify({ ...reaction, reactionType: data.reactionType });
    await this.client.hset(`reaction:${postId}`, userId.toString(), updatedReactionJson);
    this.updatePostBasedonReaction(data, 'inc', reaction.reactionType);
    return true;
  }

  async deleteReaction(data: reactionAttrs): Promise<void> {
    const { postId, userId } = data;
    await this.client.hdel(`reaction:${postId}`, userId.toString());
  }

  private getUpdatedReaction(userReaction: reactionType, reactions: reactions, type: string): reactions {
    console.log(userReaction, 'userrrr', reactions[userReaction], reactions);
    reactions[userReaction] = type === 'dec' ? reactions[userReaction] - 1 : reactions[userReaction] + 1;
    return reactions;
  }

  private async updatePostBasedonReaction(
    data: reactionAttrs,
    type: 'inc' | 'dec',
    prevReaction?: reactionType
  ): Promise<postAttrs | undefined> {
    const { postId, reactionType, profilePic } = data;
    const post = await postCache.getPost(postId);
    if (!post) throw new NotFoundError(`Post based on this id:${postId} is not avialable`);

    let reactions = post.reactions;

    if (prevReaction) {
      const reactions = this.getUpdatedReaction(prevReaction, post.reactions, 'dec');
      this.getUpdatedReaction(reactionType, reactions, 'inc');

      return postCache.updatePost(postId.toString(), { reactions, profilePic, totalReaction: post.totalReaction });
    }

    reactions = this.getUpdatedReaction(reactionType, post.reactions, type);
    let totalReaction = type === 'dec' ? (post.totalReaction -= 1) : (post.totalReaction += 1);

    await postCache.updatePost(postId.toString(), { reactions, totalReaction });
  }
}

export const reactionCache = new ReactionCache();
