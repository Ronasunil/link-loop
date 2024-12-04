import { postAttrs, postWithImageUpdationProps } from '@utils/features/posts/interfaces/postInterfaces';
import { BaseCache } from './baseCache';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError } from '@global/helpers/errorHandler';

class PostCache extends BaseCache {
  constructor() {
    super();
  }
  async addPost(data: postAttrs): Promise<void> {
    const { _id: postId, userId } = data;

    const postData = JSON.stringify(data);
    await this.client.set(`post:${postId}`, postData);

    // add postId with associated userId
    await this.client.sadd(`userPosts:${userId}`, `post:${postId}`);

    // add all postIds
    await this.client.sadd('postIds', `post:${postId}`);
  }

  async getPostsByUserId(userId: string, skip: number, limit: number): Promise<postAttrs[] | []> {
    const posts: postAttrs[] = [];
    const postKeys = (await this.client.smembers(`userPosts:${userId}`)).slice(skip, limit);

    if (!postKeys.length) return [];

    for (const key of postKeys) {
      const post = await this.client.get(key);

      if (!post) continue;
      posts.push(JSON.parse(post));
    }

    return posts;
  }

  async getPostVideosByUserId(userId: string, skip: number, limit: number): Promise<postAttrs[] | []> {
    const posts: postAttrs[] = [];

    const postKeys = (await this.client.smembers(`userPosts:${userId}`)).slice(skip, limit);
    if (!postKeys.length) return posts;

    for (const key of postKeys) {
      const postJson = await this.client.get(key);
      if (!postJson) continue;

      const post = JSON.parse(postJson) as postAttrs;

      if (post.videoId && post.videoVersion) posts.push(post);
    }

    return posts;
  }

  async getPostImagesByUserId(userId: string, skip: number, limit: number): Promise<postAttrs[] | []> {
    const posts: postAttrs[] = [];

    const postKeys = await this.client.smembers(`userPosts:${userId}`);

    if (!postKeys.length) return [];

    for (const key of postKeys) {
      const postJson = await this.client.get(key);
      if (!postJson) continue;

      const post = JSON.parse(postJson);

      const postWithImage = post.imageId && post.imageVersion ? post : null;

      if (postWithImage) posts.push(postWithImage);
    }
    return posts.length > 0 ? posts.slice(skip, limit) : [];
  }

  async getPost(identifier: string | mongoose.Types.ObjectId): Promise<postAttrs | null> {
    const post = await this.client.get(`post:${identifier}`);
    if (!post) return null;

    return JSON.parse(post);
  }

  async getAllPost(skip: number, limit: number): Promise<postAttrs[] | []> {
    const posts: postAttrs[] = [];
    const postKeys = await this.client.smembers('postIds');
    if (!postKeys.length) return [];

    for (const key of postKeys) {
      const postJson = await this.client.get(key);
      if (!postJson) continue;

      posts.push(JSON.parse(postJson));
    }

    return posts.slice(skip, limit);
  }

  async getUsersPost(userId: string): Promise<string[]> {
    const userPosts = await this.client.smembers(`userPosts:${userId}`);
    return userPosts;
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    await this.client.srem(`user:${userId}`, `post:${postId}`);
    await this.client.srem('postIds', `post:${postId}`);

    await this.client.del(`post:${postId}`);
  }

  async updatePost(postId: string, data: postWithImageUpdationProps): Promise<postAttrs> {
    const post = await this.getPost(postId);

    if (!post) throw new BadRequestError(`Can't find item`);

    const updatedData = JSON.stringify({ ...post, ...data });

    await this.client.set(`post:${postId}`, updatedData);

    return JSON.parse(updatedData) as postAttrs;
  }

  async getTotalReaction(postId: string): Promise<number> {
    const post = await this.getPost(postId);
    if (!post) throw new NotFoundError(`Post based on this id:${postId} is not avialable`);
    return Number.parseInt(`${post.totalReaction}`);
  }
}

export const postCache = new PostCache();
