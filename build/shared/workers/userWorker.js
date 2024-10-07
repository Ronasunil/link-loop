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
exports.UserWorker = void 0;
const userService_1 = require("../services/db/userService");
const userQueue_1 = require("../services/queue/userQueue");
class UserWorker {
    constructor() {
        this.socialUpdationQueue = new userQueue_1.UserQueue('socialUpdationQueue');
        this.basicInfoUpdationQueue = new userQueue_1.UserQueue('basicInfoUpdationQueue');
        this.notificationUpdationQueue = new userQueue_1.UserQueue('notificationUpdationqueue');
    }
    prepareQueueForSocialUpdation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.socialUpdationQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForBasicInfoUpdation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.basicInfoUpdationQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForNotificationUpdation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationUpdationQueue.addToQueue(data);
            return this;
        });
    }
    updateNotification() {
        this.notificationUpdationQueue.processQueue(this.updateNotificationFn);
    }
    updateUserSocialLink() {
        this.socialUpdationQueue.processQueue(this.updateSocialLinksFn);
    }
    updateBasicInfo() {
        this.basicInfoUpdationQueue.processQueue(this.updateBasicinfoFn);
    }
    updateSocialLinksFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, data } = job.data;
            if (!data)
                return;
            yield userService_1.UserService.updateSocialLink(userId, data);
        });
    }
    updateBasicinfoFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, data } = job.data;
            if (!data)
                return;
            yield userService_1.UserService.updateBasicinfo(userId, data);
        });
    }
    updateNotificationFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, data } = job.data;
            console.log(userId, data);
            yield userService_1.UserService.updateNotification(userId, data);
        });
    }
}
exports.UserWorker = UserWorker;
