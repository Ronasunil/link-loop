import { config } from '@utils/config';
import { Redis } from 'ioredis';

export class BaseCache {
  public client;
  constructor() {
    this.client = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      connectTimeout: 20000,
    });

    this.listner(this.client);
  }

  private listner(client: Redis) {
    client.on('error', (err: Error) => console.log(`err occured ${err.message}`));
    client.on('reconnecting', (times: number) => console.log(`Reconnecting redis (attempt:${times} ) ...`));
    client.on('connect', () => console.log('Redis connected successfully'));
  }
}
