import { commentAttrs, commentParam, commentUpdationProps } from '@comment/interfaces/commentInterface';
import { CommentService } from '@services/db/commentService';
import { CommentQueue } from '@services/queue/commentQueue';
import { Job } from 'bullmq';

export class CommentWorker {
  private commentQueue = new CommentQueue('commentQueue');

  createComment(): void {
    this.commentQueue.processQueue(this.createCommentFn);
  }

  updateComment(postId: string): void {
    this.commentQueue.processQueue(this.updateCommentFn(postId));
  }

  deleteComment() {
    this.commentQueue.processQueue(this.deleteCommentFn);
  }

  async prepareQueueForCreation(data: commentAttrs): Promise<this> {
    await this.commentQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForUpdation(data: commentUpdationProps): Promise<this> {
    await this.commentQueue.addToQueue(data);
    return this;
  }
  async prepareQueueForDeletion(data: commentParam): Promise<this> {
    await this.commentQueue.addToQueue(data);
    return this;
  }

  private async createCommentFn(job: Job): Promise<void> {
    const data = job.data as commentAttrs;
    await CommentService.addCommentDb(data);
  }

  private updateCommentFn(postId: string): (job: Job) => Promise<void> {
    return async function (job: Job) {
      const data = job.data as commentUpdationProps;

      await CommentService.updateCommentDb(postId, data);
    };
  }

  private async deleteCommentFn(job: Job) {
    const data = job.data as commentParam;
    await CommentService.deleteCommentDb(data.postId, data.commentId);
  }
}
