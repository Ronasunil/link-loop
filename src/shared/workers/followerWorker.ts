import { dbFolloweAttr, followerData } from '@follower/interfaces/followerInterface';
import { FollowerService } from '@services/db/followerService';
import { FollowerQueue, UnfollowerQueue } from '@services/queue/followerQueue';
import { Job } from 'bullmq';

export class FollowerWorker {
  private followerQueue = new FollowerQueue('followerQueue');

  follow(): void {
    this.followerQueue.processQueue(this.followFn);
  }

  async prepareQueueForFollowing(data: dbFolloweAttr): Promise<this> {
    await this.followerQueue.addToQueue(data);
    return this;
  }

  private async followFn(job: Job): Promise<void> {
    const data = job.data as dbFolloweAttr;
    await FollowerService.addFollowerDb(data);
  }
}

export class UnfollowerWorker {
  private followerQueue = new UnfollowerQueue('unFollowerQueue');

  unfollow() {
    this.followerQueue.processQueue(this.unfollowFn);
  }

  async preparQueueForUnFollow(data: dbFolloweAttr): Promise<this> {
    await this.followerQueue.addToQueue(data);
    return this;
  }

  private async unfollowFn(job: Job): Promise<void> {
    const data = job.data as dbFolloweAttr;
    await FollowerService.removeFollowerDb(data);
  }
}
