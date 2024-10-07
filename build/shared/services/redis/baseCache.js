"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCache = void 0;
const config_1 = require("../../../config");
const ioredis_1 = require("ioredis");
class BaseCache {
    constructor() {
        this.client = new ioredis_1.Redis({
            host: config_1.config.REDIS_HOST,
            port: config_1.config.REDIS_PORT,
        });
    }
}
exports.BaseCache = BaseCache;
