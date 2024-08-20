import mongoose from 'mongoose';
import { config } from '@utils/config';
import { Redis } from 'ioredis';

export class Database {
  get MONGOURI() {
    return config.MONGO_URI;
  }

  get REDIS_HOST() {
    return config.REDIS_HOST;
  }

  get REDIS_PORT() {
    return config.REDIS_PORT;
  }

  async startDb() {
    console.log(this.MONGOURI);
    mongoose
      .connect(this.MONGOURI!)
      .then(() => console.log('Successfully connected to Database'))
      .catch((err) => {
        console.log('Database connection failed', err.message);
        console.log('Trying to reconnect...');
        mongoose.connection.on('fail', async () => await this.startDb());
      });
  }

  async startCache() {
    const redis = new Redis({
      host: this.REDIS_HOST,
      port: this.REDIS_PORT,
    });

    console.log(await redis.ping());
  }
}
