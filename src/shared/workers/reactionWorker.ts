import { reactionAttrs } from '@reaction/interfaces/reactionInterface';
import { ReactionService } from '@services/db/reactionService';
import { ReactionQueue } from '@services/queue/reactionQueue';
import { Job } from 'bullmq';

export class ReactionWorker {
  private reactionQueue = new ReactionQueue('reactionQueue');

  createReaction() {
    this.reactionQueue.processQueue(this.createReactionFn);
  }

  async prepareQueue(data: reactionAttrs): Promise<this> {
    await this.reactionQueue.addToQueue(data);
    return this;
  }

  private async createReactionFn(job: Job) {
    const data = job.data as reactionAttrs;
    await ReactionService.addReactionDb(data);
  }
}
