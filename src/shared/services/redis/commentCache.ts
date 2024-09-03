import { commentAttrs, commentNamesList, commentUpdationProps } from '@comment/interfaces/commentInterface';
import { BaseCache } from './baseCache';
import { postCache } from './postCache';
import { NotFoundError } from '@global/helpers/errorHandler';

class CommentCache extends BaseCache {
  constructor() {
    super();
  }

  async addComment(data: commentAttrs): Promise<void> {
    const { _id, postId } = data;
    const commentJson = JSON.stringify(data);
    await this.client.hset(`comment:${postId}`, _id.toString(), commentJson);

    // increment post total coment  by 1
    const post = await postCache.getPost(postId);
    if (!post) throw new NotFoundError(`Post based on this particular id:${postId} not found`);

    const totalCount = post.totalComments + 1;
    await postCache.updatePost(postId, { totalComments: totalCount });
  }

  async updateComment(postId: string, commentId: string, data: commentUpdationProps): Promise<void> {
    const commentJson = await this.client.hget(`comment:${postId}`, `${commentId}`);
    if (!commentJson) throw new NotFoundError(`Comment based on this particular id:${commentId} not found`);
    const comment = JSON.parse(commentJson);

    const updatedData = JSON.stringify({ ...comment, ...data });
    this.client.hset(`comment:${postId}`, `${commentId}`, updatedData);
  }

  async deleteComment(postId: string, commentId: string): Promise<void> {
    const commentJson = await this.client.hget(`comment:${postId}`, `${commentId}`);
    if (!commentJson) throw new NotFoundError(`Comment based on this particular id:${commentId} not found`);

    await this.client.hdel(`comment:${postId}`, `${commentId}`);
    await this.client.lrem(`postComment:${postId}`, 1, commentJson);

    // decrement post total coment  by 1
    const post = await postCache.getPost(postId);
    if (!post) throw new NotFoundError(`Post based on this particular id:${postId} not found`);
    const commentCount = post.totalComments - 1;

    postCache.updatePost(postId, { totalComments: commentCount });
  }

  async getComment(postId: string, commentId: string): Promise<commentAttrs> {
    const commentJson = await this.client.hget(`comment:${postId}`, `${commentId}`);
    if (!commentJson) throw new NotFoundError(`Comment based on this particular id:${commentId} not found`);

    return JSON.parse(commentJson) as commentAttrs;
  }

  async getPostComments(postId: string): Promise<commentAttrs[]> {
    const commentsJson = await this.client.hgetall(`comment:${postId}`);
    if (!commentsJson) throw new NotFoundError(`Comment based on this particular id:${postId} not found`);

    const comments = Object.values(commentsJson).map((c) => JSON.parse(c)) as commentAttrs[];

    return comments;
  }

  async getPostCommentNames(postId: string): Promise<commentNamesList> {
    const commentsJson = await this.client.hgetall(`comment:${postId}`);
    if (!commentsJson) throw new NotFoundError(`Comment based on this particular id:${postId} not found`);

    const names = Object.values(commentsJson).map((c) => {
      const user = JSON.parse(c) as commentAttrs;
      return user.userName;
    });
    return { names, count: names.length };
  }
}

export const commentCache = new CommentCache();
