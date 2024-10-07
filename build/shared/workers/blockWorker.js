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
exports.BlockWorker = void 0;
const blockUserService_1 = require("../services/db/blockUserService");
const blockQueue_1 = require("../services/queue/blockQueue");
class BlockWorker {
    constructor() {
        this.blockQueue = new blockQueue_1.BlockQueue('blockQueue');
    }
    prepareQueueForBlock(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForUnblock(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockQueue.addToQueue(data);
            return this;
        });
    }
    blockUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.blockQueue.processQueue(this.blockUserFn);
        });
    }
    unblockUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.blockQueue.processQueue(this.unblockUserFn);
        });
    }
    blockUserFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, blockUserId } = job.data;
            yield blockUserService_1.BlockUserService.blockUser(userId, blockUserId);
        });
    }
    unblockUserFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, unblockUserId } = job.data;
            yield blockUserService_1.BlockUserService.unBlockUser(userId, unblockUserId);
        });
    }
}
exports.BlockWorker = BlockWorker;
