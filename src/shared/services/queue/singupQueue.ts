import { Job, Worker } from 'bullmq';
import { BaseQueue } from './baseQueue';

export class SignupQueue extends BaseQueue {
  constructor(queueName: string) {
    super(queueName);
  }

  async addToQueue(data: any): Promise<void> {
    await this.queue.add(this.queue.name, data, { attempts: 3, delay: 1000 });
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
