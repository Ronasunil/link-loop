import { Job, Worker } from 'bullmq';
import { BaseQueue } from './baseQueue';

export class ChatQueue extends BaseQueue {
  constructor(ququeName: string) {
    super(ququeName);
  }
  async addToQueue(data: any): Promise<void> {
    await this.queue.add(this.queue.name, data, { attempts: 3, delay: 1000, priority: 1 });
  }

  processQueue(processFn: (job: Job) => Promise<void>): void {
    const worker = new Worker(this.queue.name, (job: Job) => processFn(job), { connection: this.connectionOptions });

    worker.on('completed', (job: Job) => {
      console.log(`Chat worker job has completed ${job}`);
    });

    worker.on('failed', (_job, err) => {
      console.error(`Chat worker Job has failed with error ${err}`);
    });
  }
}
