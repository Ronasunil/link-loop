"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQueue = void 0;
const express_1 = require("@bull-board/express");
const config_1 = require("../../../config");
const bullmq_1 = require("bullmq");
const api_1 = require("@bull-board/api");
const bullAdapter_1 = require("@bull-board/api/bullAdapter");
class BaseQueue {
    constructor(queueName) {
        this.connectionOptions = {
            host: '127.0.0.1',
            port: 6379,
        };
        this.queue = new bullmq_1.Queue(queueName, {
            connection: {
                host: config_1.config.REDIS_HOST,
                port: config_1.config.REDIS_PORT,
            },
        });
        this.serverAdapter = new express_1.ExpressAdapter();
        this.serverAdapter.setBasePath('/developer/queue');
        (0, api_1.createBullBoard)({
            queues: [new bullAdapter_1.BullAdapter(this.queue)],
            serverAdapter: this.serverAdapter,
        });
    }
    routes() {
        return this.serverAdapter.getRouter();
    }
}
exports.BaseQueue = BaseQueue;
