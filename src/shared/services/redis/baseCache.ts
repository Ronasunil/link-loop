import { config } from '@utils/config';
import { Redis } from 'ioredis';

export class BaseCache {
  public client;
  constructor() {
    this.client = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    });
  }
}
