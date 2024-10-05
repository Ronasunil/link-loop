import { UserService } from '@services/db/userService';
import { UserQueue } from '@services/queue/userQueue';
import {
  updateBasicinfoJob,
  updateNotificationJob,
  updateSocialLinksJob,
  userSettingsUpdationProp,
} from '@users/interface/user.interface';
import { Job } from 'bullmq';

export class UserWorker {
  private socialUpdationQueue = new UserQueue('socialUpdationQueue');
  private basicInfoUpdationQueue = new UserQueue('basicInfoUpdationQueue');
  private notificationUpdationQueue = new UserQueue('notificationUpdationqueue');

  async prepareQueueForSocialUpdation(data: updateSocialLinksJob): Promise<this> {
    await this.socialUpdationQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForBasicInfoUpdation(data: updateBasicinfoJob): Promise<this> {
    await this.basicInfoUpdationQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForNotificationUpdation(data: updateNotificationJob): Promise<this> {
    await this.notificationUpdationQueue.addToQueue(data);
    return this;
  }

  updateNotification() {
    this.notificationUpdationQueue.processQueue(this.updateNotificationFn);
  }

  updateUserSocialLink() {
    this.socialUpdationQueue.processQueue(this.updateSocialLinksFn);
  }

  updateBasicInfo() {
    this.basicInfoUpdationQueue.processQueue(this.updateBasicinfoFn);
  }

  private async updateSocialLinksFn(job: Job) {
    const { userId, data } = job.data as updateSocialLinksJob;
    if (!data) return;

    await UserService.updateSocialLink(userId, data);
  }

  private async updateBasicinfoFn(job: Job) {
    const { userId, data } = job.data as updateBasicinfoJob;
    if (!data) return;
    await UserService.updateBasicinfo(userId, data);
  }

  private async updateNotificationFn(job: Job) {
    const { userId, data } = job.data as updateNotificationJob;
    console.log(userId, data);
    await UserService.updateNotification(userId, data);
  }
}
