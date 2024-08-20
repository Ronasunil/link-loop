import { SignupQueue } from '@services/queue/singupQueue';
import {
  userAttrs,
  userDoc,
} from '@utils/features/users/interface/user.interface';
import { userModel } from '@utils/features/users/models/userModel';
import { Job } from 'bullmq';

export class SignupWorker {
  signupQueue: SignupQueue = new SignupQueue('signupQueue');

  constructor() {
    this.signupQueue.processQueue(this.createUser);
  }

  saveToDb(data: userAttrs) {
    console.log(data, 'data');
    this.signupQueue.addToQueue(data);
  }

  createUser(job: Job) {
    const data = job.data as userDoc;
    userModel.create(data);
  }
}
