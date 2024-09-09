import { ImageService } from '@services/db/imageService';
import { ImageQueue } from '@services/queue/imageQueue';
import { deleteWorkerJob, imageWorkerJob } from '@utils/features/image/interfaces/imageInterface';
import { Job } from 'bullmq';

export class ImageWorker {
  private imageProfileCreationQueue = new ImageQueue('imageCreationQueue');
  private imageBgCreationQueue = new ImageQueue('imageBgCreationQueue');
  private imageProfileDeletionQueue = new ImageQueue('imageProfileDeletionQueue');
  private imageBgDeletionQueue = new ImageQueue('imageBgDeletionQueue');

  async prepareQueueForProfile(data: imageWorkerJob): Promise<this> {
    await this.imageProfileCreationQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForProfileDeletion(data: deleteWorkerJob): Promise<this> {
    this.imageProfileDeletionQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForBg(data: imageWorkerJob): Promise<this> {
    await this.imageBgCreationQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForBgDeletion(data: deleteWorkerJob): Promise<this> {
    await this.imageBgDeletionQueue.addToQueue(data);
    return this;
  }

  addProfileImg() {
    this.imageProfileCreationQueue.processQueue(this.addProfileImgFn);
  }

  addBgImg() {
    this.imageBgCreationQueue.processQueue(this.addBgImgFn);
  }

  deleteProfileImg() {
    this.imageProfileDeletionQueue.processQueue(this.deleteProfileImgFn);
  }

  delteBgImg() {
    this.imageBgDeletionQueue.processQueue(this.deleteBgImgFn);
  }

  private async addBgImgFn(job: Job) {
    const { userId, url, imageId, imageVersion, type } = job.data as imageWorkerJob;
    await ImageService.addBgImageDb(userId.toString(), url, imageId, imageVersion, type);
  }

  private async addProfileImgFn(job: Job) {
    const { userId, url, imageId, imageVersion, type } = job.data as imageWorkerJob;
    await ImageService.addProfileImage(userId.toString(), url, imageId, imageVersion, type);
  }

  private async deleteProfileImgFn(job: Job) {
    const { userId, imageId } = job.data as deleteWorkerJob;
    await ImageService.deleteProfileImageDb(imageId, userId);
  }

  private async deleteBgImgFn(job: Job) {
    const { userId, imageId } = job.data as deleteWorkerJob;
    await ImageService.deleteBgImageDb(imageId, userId);
  }
}
