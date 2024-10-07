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
exports.UnfollowerWorker = exports.FollowerWorker = void 0;
const followerService_1 = require("../services/db/followerService");
const followerQueue_1 = require("../services/queue/followerQueue");
class FollowerWorker {
    constructor() {
        this.followerQueue = new followerQueue_1.FollowerQueue('followerQueue');
    }
    follow() {
        this.followerQueue.processQueue(this.followFn);
    }
    prepareQueueForFollowing(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.followerQueue.addToQueue(data);
            return this;
        });
    }
    followFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = job.data;
            yield followerService_1.FollowerService.addFollowerDb(data);
        });
    }
}
exports.FollowerWorker = FollowerWorker;
class UnfollowerWorker {
    constructor() {
        this.followerQueue = new followerQueue_1.UnfollowerQueue('unFollowerQueue');
    }
    unfollow() {
        this.followerQueue.processQueue(this.unfollowFn);
    }
    preparQueueForUnFollow(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.followerQueue.addToQueue(data);
            return this;
        });
    }
    unfollowFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = job.data;
            yield followerService_1.FollowerService.removeFollowerDb(data);
        });
    }
}
exports.UnfollowerWorker = UnfollowerWorker;
