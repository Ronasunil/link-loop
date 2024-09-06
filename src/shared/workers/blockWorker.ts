import { blockJob, unblockJob } from '@follower/interfaces/followerInterface';
import { BlockUserService } from '@services/db/blockUserService';
import { BlockQueue } from '@services/queue/blockQueue';
import { Job } from 'bullmq';

export class BlockWorker {
  private blockQueue = new BlockQueue('blockQueue');

  async prepareQueueForBlock(data: blockJob): Promise<this> {
    await this.blockQueue.addToQueue(data);

    return this;
  }

  async prepareQueueForUnblock(data: unblockJob): Promise<this> {
    await this.blockQueue.addToQueue(data);
    return this;
  }

  async blockUser() {
    this.blockQueue.processQueue(this.blockUserFn);
  }

  async unblockUser() {
    this.blockQueue.processQueue(this.unblockUserFn);
  }

  async blockUserFn(job: Job) {
    const { userId, blockUserId } = job.data as blockJob;
    await BlockUserService.blockUser(userId, blockUserId);
  }

  async unblockUserFn(job: Job) {
    const { userId, unblockUserId } = job.data as unblockJob;
    await BlockUserService.unBlockUser(userId, unblockUserId);
  }
}
