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
    this.postQueue.processQueue(this.deletePostFn);
  }

  prepareQueueForCreation(data: postAttrs): this {
    this.postQueue.addToQueue(data);
    return this;
  }

  prepareQueueForUpdation(data: postWithImageUpdationProps): this {
    this.postQueue.addToQueue(data);
    return this;
  }

  prepareQueueForDeletion(postId: string): this {
    this.postQueue.addToQueue(postId);
    return this;
  }

  createPost(job: Job): void {
    const data = job.data as postAttrs;
    postModel.create(data);
  }

  updatePostFn(postId: string): (job: Job) => void {
    return function (job: Job) {
      const data = job.data as postUpdationProps;
      PostService.updatePostDb(postId, data);
    };
  }

  deletePostFn(job: Job): void {
    const postId = job.data as string;
    PostService.deletePostsDb(postId);
  }
}
