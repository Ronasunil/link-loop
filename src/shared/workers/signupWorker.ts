import { SignupQueue } from '@services/queue/singupQueue';
import { authModel } from '@utils/features/auth/models/authModel';
import { userAttrs, userDoc } from '@utils/features/users/interface/user.interface';
import { userModel } from '@utils/features/users/models/userModel';
import { Job } from 'bullmq';

export class SignupWorker {
  private signupQueue: SignupQueue = new SignupQueue('signupQueue');

  constructor() {
    this.signupQueue.processQueue(this.createUser);
  }

  saveToDb(data: userAttrs) {
    this.signupQueue.addToQueue(data);
  }

  async createUser(job: Job) {
    const data = job.data as userDoc;
    await userModel.create(data);
  }
}
