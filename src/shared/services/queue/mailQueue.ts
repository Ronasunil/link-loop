import { mailTo } from '@utils/features/auth/interfaces/auth.interface';
import { BaseQueue } from './baseQueue';
import { Job, Worker } from 'bullmq';

export class MailQueue extends BaseQueue {
  constructor(queueName: string) {
    super(queueName);
  }
  addToQueue(data: mailTo): void {
    this.queue.add(this.queue.name, data, { attempts: 3, delay: 1000 });
  }

  processQueue(processFn: (job: Job) => void): void {
    const worker = new Worker(this.queue.name, async (job: Job) => processFn(job), {
      connection: this.connectionOptions,
    });

    worker.on('completed', (job: Job) => {
      console.log(`job has completed ${job}`);
    });

    worker.on('failed', (_job, err) => {
      console.error(`Job has failed with error ${err}`);
    });
  }
}
