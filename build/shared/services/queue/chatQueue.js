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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatQueue = void 0;
const bullmq_1 = require("bullmq");
const baseQueue_1 = require("./baseQueue");
class ChatQueue extends baseQueue_1.BaseQueue {
    constructor(ququeName) {
        super(ququeName);
    }
    addToQueue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.queue.add(this.queue.name, data, { attempts: 3, delay: 1000, priority: 1 });
        });
    }
    processQueue(processFn) {
        const worker = new bullmq_1.Worker(this.queue.name, (job) => processFn(job), { connection: this.connectionOptions });
        worker.on('completed', (job) => {
            console.log(`Chat worker job has completed ${job}`);
        });
        worker.on('failed', (_job, err) => {
            console.error(`Chat worker Job has failed with error ${err}`);
        });
    }
}
exports.ChatQueue = ChatQueue;
