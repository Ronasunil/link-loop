"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
class Config {
    constructor() {
        this.loadConfig();
        this.validateConfig();
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.SERVER_URL = process.env.SERVER_URL;
        this.MONGO_URI = process.env.MONGO_URI;
        this.NODE_ENV = process.env.NODE_ENV;
        this.SESSION_SECRET = process.env.SESSION_SECRET;
        this.REDIS_CLIENT = process.env.REDIS_CLIENT;
        this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
        this.CLOUD_NAME = process.env.CLOUD_NAME;
        this.CLOUD_SECRET_KEY = process.env.CLOUD_SECRET_KEY;
        this.REDIS_HOST = process.env.REDIS_HOST;
        this.REDIS_PORT = Number.parseInt(process.env.REDIS_PORT);
        this.PORT = Number.parseInt(process.env.PORT);
        this.CLOUDINARY_BASE_URL = process.env.CLOUDINARY_BASE_URL;
        this.ETHEREAL_HOST = process.env.ETHEREAL_HOST;
        this.ETHEREAL_PORT = Number.parseInt(process.env.ETHEREAL_PORT);
        this.ETHEREAL_EMAIL = process.env.ETHEREAL_EMAIL;
        this.ETHEREAL_PASSWORD = process.env.ETHEREAL_PASSWORD;
        this.BREVO_HOST = process.env.BREVO_HOST;
        this.BREVO_EMAIL = process.env.BREVO_EMAIL;
        this.BREVO_PORT = Number.parseInt(process.env.BREVO_PORT);
        this.BREVO_PASSWORD = process.env.BREVO_PASSWORD;
        this.DEFAULT_PROFILE_IMG = process.env.DEFAULT_PROFILE_IMG;
        this.PAGE_lIMIT = Number.parseInt(process.env.PAGE_LIMIT);
    }
    validateConfig() {
        for (let [key, value] of Object.entries(this)) {
            if (!value)
                throw new Error(`${key}  is undefined`);
        }
    }
    loadConfig() {
        try {
            dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../config.env') });
        }
        catch (err) {
            console.log('error loading env variables', err);
        }
    }
    cloudinaryConfig() {
        cloudinary_1.v2.config({
            cloud_name: this.CLOUD_NAME,
            api_key: this.CLOUD_API_KEY,
            api_secret: this.CLOUD_SECRET_KEY,
        });
    }
}
exports.config = new Config();
