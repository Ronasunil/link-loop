import { post } from '@post/controllers/postCreate';
import { PostService } from '@services/db/postService';
import { PostQueue } from '@services/queue/postQueue';
import {
  postAttrs,
  postUpdationProps,
  postWithImageUpdationProps,
} from '@utils/features/posts/interfaces/postInterfaces';
import { postModel } from '@utils/features/posts/models/postModel';
import { Job } from 'bullmq';

export class PostWorker {
  private postQueue: PostQueue = new PostQueue('postQueue');

  addPost() {
    this.postQueue.processQueue(this.createPost);
  }

  updatePost(postId: string): void {
    this.postQueue.processQueue(this.updatePostFn(postId));
  }

  deletePost(): void {
    console.log('macho here it gets');
    this.postQueue.processQueue(this.deletePostFn);
  }

  async prepareQueueForCreation(data: postAttrs): Promise<this> {
    await this.postQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForUpdation(data: postWithImageUpdationProps): Promise<this> {
    await this.postQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForDeletion(postId: string): Promise<this> {
    console.log('hereee');
    await this.postQueue.addToQueue(postId);
    return this;
  }

  async createPost(job: Job): Promise<void> {
    const data = job.data as postAttrs;
    await postModel.create(data);
  }

  updatePostFn(postId: string): (job: Job) => void {
    return async function (job: Job) {
      const data = job.data as postUpdationProps;
      await PostService.updatePostDb(postId, data);
    };
  }

  async deletePostFn(job: Job): Promise<void> {
    const postId = job.data as string;
    await PostService.deletePostsDb(postId);
  }
}
