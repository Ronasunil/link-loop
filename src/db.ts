import mongoose from 'mongoose';
import { config } from './config';

export class Database {
  get MONGOURI() {
    return config.MONGO_URI;
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
}
