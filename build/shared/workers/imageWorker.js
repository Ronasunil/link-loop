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
exports.ImageWorker = void 0;
const imageService_1 = require("../services/db/imageService");
const imageQueue_1 = require("../services/queue/imageQueue");
class ImageWorker {
    constructor() {
        this.imageProfileCreationQueue = new imageQueue_1.ImageQueue('imageCreationQueue');
        this.imageBgCreationQueue = new imageQueue_1.ImageQueue('imageBgCreationQueue');
        this.imageProfileDeletionQueue = new imageQueue_1.ImageQueue('imageProfileDeletionQueue');
        this.imageBgDeletionQueue = new imageQueue_1.ImageQueue('imageBgDeletionQueue');
    }
    prepareQueueForProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.imageProfileCreationQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForProfileDeletion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.imageProfileDeletionQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForBg(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.imageBgCreationQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForBgDeletion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.imageBgDeletionQueue.addToQueue(data);
            return this;
        });
    }
    addProfileImg() {
        this.imageProfileCreationQueue.processQueue(this.addProfileImgFn);
    }
    addBgImg() {
        this.imageBgCreationQueue.processQueue(this.addBgImgFn);
    }
    deleteProfileImg() {
        this.imageProfileDeletionQueue.processQueue(this.deleteProfileImgFn);
    }
    delteBgImg() {
        this.imageBgDeletionQueue.processQueue(this.deleteBgImgFn);
    }
    addBgImgFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, url, imageId, imageVersion, type } = job.data;
            yield imageService_1.ImageService.addBgImageDb(userId.toString(), url, imageId, imageVersion, type);
        });
    }
    addProfileImgFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, url, imageId, imageVersion, type } = job.data;
            yield imageService_1.ImageService.addProfileImage(userId.toString(), url, imageId, imageVersion, type);
        });
    }
    deleteProfileImgFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, imageId } = job.data;
            yield imageService_1.ImageService.deleteProfileImageDb(imageId, userId);
        });
    }
    deleteBgImgFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, imageId } = job.data;
            yield imageService_1.ImageService.deleteBgImageDb(imageId, userId);
        });
    }
}
exports.ImageWorker = ImageWorker;
