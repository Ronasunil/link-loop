import { Job, Worker } from 'bullmq';
import { BaseQueue } from './baseQueue';

export class BlockQueue extends BaseQueue {
  constructor(ququeName: string) {
    super(ququeName);
  }
  async addToQueue(data: any): Promise<void> {
    await this.queue.add(this.queue.name, data, { attempts: 3, delay: 1000 });
  }

  processQueue(processFn: (job: Job) => Promise<void>): void {
    new Worker(this.queue.name, async (job: Job) => processFn(job), { connection: this.connectionOptions });
  }
}
