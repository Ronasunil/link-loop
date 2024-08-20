"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
class Config {
    constructor() {
        this.loadConfig();
        this.validateConfig();
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.MONGO_URI = process.env.MONGO_URI;
        this.NODE_ENV = process.env.NODE_ENV;
        this.SESSION_SECRET = process.env.SESSION_SECRET;
        this.REDIS_CLIENT = process.env.REDIS_CLIENT;
        this.PORT = Number.parseInt(process.env.PORT);
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
}
exports.config = new Config();
