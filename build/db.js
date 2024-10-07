"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const ioredis_1 = require("ioredis");
class Database {
    get MONGOURI() {
        return config_1.config.MONGO_URI;
    }
    get REDIS_HOST() {
        return config_1.config.REDIS_HOST;
    }
    get REDIS_PORT() {
        return config_1.config.REDIS_PORT;
    }
    startDb() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.MONGOURI);
            mongoose_1.default
                .connect(this.MONGOURI)
                .then(() => console.log('Successfully connected to Database'))
                .catch((err) => {
                console.log('Database connection failed', err.message);
                console.log('Trying to reconnect...');
                mongoose_1.default.connection.on('fail', () => __awaiter(this, void 0, void 0, function* () { return yield this.startDb(); }));
            });
        });
    }
    startCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const redis = new ioredis_1.Redis({
                host: this.REDIS_HOST,
                port: this.REDIS_PORT,
            });
            console.log(yield redis.ping());
        });
    }
}
exports.Database = Database;
