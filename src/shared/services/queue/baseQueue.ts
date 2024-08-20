import { ExpressAdapter } from '@bull-board/express';
import { config } from '@utils/config';
import { Job, Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

export abstract class BaseQueue {
  public queue: Queue;
  public serverAdapter: ExpressAdapter;
  public connectionOptions;

  abstract addToQueue(data: any): void;
  abstract processQueue(processFn: (job: Job) => void): void;

  constructor(queueName: string) {
    this.connectionOptions = {
      host: '127.0.0.1',
      port: 6379,
    };
    this.queue = new Queue(queueName, {
      connection: { host: config.REDIS_HOST, port: config.REDIS_PORT },
    });

    this.serverAdapter = new ExpressAdapter();

    createBullBoard({
      queues: [new BullAdapter(this.queue)],
      serverAdapter: this.serverAdapter,
    });
  }
}
