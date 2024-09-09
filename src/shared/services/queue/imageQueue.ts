import { Job, Worker } from 'bullmq';
import { BaseQueue } from './baseQueue';

export class ImageQueue extends BaseQueue {
  constructor(queueName: string) {
    super(queueName);
  }
  async addToQueue(data: any): Promise<void> {
    await this.queue.add(this.queue.name, data, { attempts: 3, delay: 500, priority: 1 });
  }

  processQueue(processFn: (job: Job) => Promise<void>): void {
    const worker = new Worker(this.queue.name, async (job: Job) => processFn(job), {
      connection: this.connectionOptions,
    });

    worker.on('completed', (job: Job) => {
      console.log(`Image worker job has completed ${job}`);
    });

    worker.on('failed', (_job, err) => {
      console.error(`Image worker Job has failed with error ${err}`);
    });
  }
}
