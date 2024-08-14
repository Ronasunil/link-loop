import dotEnv from 'dotenv';
import path from 'path';

class Config {
  public JWT_SECRET: string | undefined;
  public SESSION_SECRET: string | undefined;
  public MONGO_URI: string | undefined;
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public PORT: Number | undefined;
  public REDIS_CLIENT: string | undefined;

  constructor() {
    this.loadConfig();
    this.validateConfig();

    this.JWT_SECRET = process.env.JWT_SECRET;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.MONGO_URI = process.env.MONGO_URI;
    this.NODE_ENV = process.env.NODE_ENV;
    this.SESSION_SECRET = process.env.SESSION_SECRET;
    this.REDIS_CLIENT = process.env.REDIS_CLIENT;
    this.PORT = Number.parseInt(process.env.PORT!);
  }

  private validateConfig() {
    for (let [key, value] of Object.entries(this)) {
      if (!value) throw new Error(`${key}  is undefined`);
    }
  }

  private loadConfig() {
    try {
      dotEnv.config({ path: path.resolve(__dirname, '../config.env') });
    } catch (err) {
      console.log('error loading env variables', err);
    }
  }
}

export const config = new Config();
