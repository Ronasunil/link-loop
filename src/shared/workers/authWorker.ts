import { AuthQueue } from '@services/queue/authQueue';
import { authAttrs } from '@utils/features/auth/interfaces/auth.interface';
import { authModel } from '@utils/features/auth/models/authModel';
import { Job } from 'bullmq';

export class AuthWorker {
  private authQueue: AuthQueue = new AuthQueue('authQueue');

  constructor() {
    this.authQueue.processQueue(this.createAuth);
  }
  saveToDb(data: authAttrs) {
    this.authQueue.addToQueue(data);
  }

  async createAuth(job: Job) {
    const data = job.data as authAttrs;
    await authModel.create(data);
  }
}
