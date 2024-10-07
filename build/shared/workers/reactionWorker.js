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
exports.ReactionWorker = void 0;
const reactionService_1 = require("../services/db/reactionService");
const reactionQueue_1 = require("../services/queue/reactionQueue");
class ReactionWorker {
    constructor() {
        this.reactionQueue = new reactionQueue_1.ReactionQueue('reactionQueue');
    }
    createReaction() {
        this.reactionQueue.processQueue(this.createReactionFn);
    }
    prepareQueue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.reactionQueue.addToQueue(data);
            return this;
        });
    }
    createReactionFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = job.data;
            yield reactionService_1.ReactionService.addReactionDb(data);
        });
    }
}
exports.ReactionWorker = ReactionWorker;
