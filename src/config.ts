import { v2 as cloudinary } from 'cloudinary';
import dotEnv from 'dotenv';
import path from 'path';

class Config {
  public JWT_SECRET: string | undefined;
  public SESSION_SECRET: string | undefined;
  public MONGO_URI: string | undefined;
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public PORT: number | undefined;
  public REDIS_CLIENT: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_SECRET_KEY: string | undefined;
  public REDIS_HOST: string | undefined;
  public REDIS_PORT: number | undefined;
  public CLOUDINARY_BASE_URL: string | undefined;
  public ETHEREAL_HOST: string | undefined;
  public ETHEREAL_PORT: number | undefined;
  public ETHEREAL_EMAIL: string | undefined;
  public ETHEREAL_PASSWORD: string | undefined;

  constructor() {
    this.loadConfig();
    this.validateConfig();

    this.JWT_SECRET = process.env.JWT_SECRET;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.MONGO_URI = process.env.MONGO_URI;
    this.NODE_ENV = process.env.NODE_ENV;
    this.SESSION_SECRET = process.env.SESSION_SECRET;
    this.REDIS_CLIENT = process.env.REDIS_CLIENT;
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
    this.CLOUD_NAME = process.env.CLOUD_NAME;
    this.CLOUD_SECRET_KEY = process.env.CLOUD_SECRET_KEY;
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.REDIS_PORT = Number.parseInt(process.env.REDIS_PORT!);
    this.PORT = Number.parseInt(process.env.PORT!);
    this.CLOUDINARY_BASE_URL = process.env.CLOUDINARY_BASE_URL;
    this.ETHEREAL_HOST = process.env.ETHEREAL_HOST;
    this.ETHEREAL_PORT = Number.parseInt(process.env.ETHEREAL_PORT!);
    this.ETHEREAL_EMAIL = process.env.ETHEREAL_EMAIL;
    this.ETHEREAL_PASSWORD = process.env.ETHEREAL_PASSWORD;
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

  public cloudinaryConfig() {
    cloudinary.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_SECRET_KEY,
    });
  }
}

export const config = new Config();
