import { ExpressAdapter } from '@bull-board/express';
import { config } from '@utils/config';
import { Job, Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

export abstract class BaseQueue {
  public queue: Queue;
  public serverAdapter: ExpressAdapter;
  public connectionOptions;

  abstract addToQueue(data: any): Promise<void>;
  abstract processQueue(processFn: (job: Job) => Promise<void>): void;

  constructor(queueName: string) {
    this.connectionOptions = {
      host: '127.0.0.1',
      port: 6379,
    };
    this.queue = new Queue(queueName, {
      connection: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
    });

    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath('/developer/queue');

    createBullBoard({
      queues: [new BullAdapter(this.queue)],
      serverAdapter: this.serverAdapter,
    });
  }

  routes() {
    return this.serverAdapter.getRouter();
  }
}
