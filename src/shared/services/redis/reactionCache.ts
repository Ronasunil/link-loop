import { reactionAttrs, reactions, reactionType } from '@reaction/interfaces/reactionInterface';
import { BaseCache } from './baseCache';

import { postCache } from './postCache';
import { NotFoundError } from '@global/helpers/errorHandler';
import { postAttrs } from '@post/interfaces/postInterfaces';

export class ReactionCache extends BaseCache {
  constructor() {
    super();
  }

  async getReaction(postId: string, authId: string): Promise<string | null> {
    return await this.client.hget(`reaction:${postId}`, authId);
  }

  async getReactionByPostId(postId: string, skip: number, limit: number): Promise<reactionAttrs[]> {
    const reactionObj = await this.client.hgetall(`reaction:${postId}`);
    const reactions = Object.values(reactionObj).map((reaction) => JSON.parse(reaction) as reactionAttrs);
    return reactions.slice(skip, limit);
  }

  async createReaction(data: reactionAttrs): Promise<void> {
    const { postId, authId } = data;

    // check if updating the reaction
    const status = await this.updateReaction(data);
    if (status) return;

    // check if its creating (it will create new reaction if no prev reaction exist)
    const reactionJson = JSON.stringify(data);
    await this.client.hset(`reaction:${postId}`, authId.toString(), reactionJson);
    await this.updatePostBasedonReaction(data, 'inc');
  }

  async updateReaction(data: reactionAttrs): Promise<boolean> {
    const { postId, authId } = data;

    // check if reaction exist
    const reactionJson = await this.getReaction(postId.toString(), authId.toString());
    if (!reactionJson) return false;

    // reaction exist
    const reaction = JSON.parse(reactionJson) as reactionAttrs;

    // deleting when user has selected same reaction twice
    if (reaction.reactionType === data.reactionType) {
      await this.deleteReaction(data);
      this.updatePostBasedonReaction(data, 'dec');
      return true;
    }

    // updating existing reaction
    const updatedReactionJson = JSON.stringify({ ...reaction, reactionType: data.reactionType });
    await this.client.hset(`reaction:${postId}`, authId.toString(), updatedReactionJson);
    this.updatePostBasedonReaction(data, 'inc', reaction.reactionType);
    return true;
  }

  async deleteReaction(data: reactionAttrs): Promise<void> {
    const { postId, authId } = data;
    await this.client.hdel(`reaction:${postId}`, authId.toString());
  }

  private getUpdatedReaction(userReaction: reactionType, reactions: reactions, type: string): reactions {
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
