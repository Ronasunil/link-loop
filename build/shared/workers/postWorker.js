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
exports.PostWorker = void 0;
const postService_1 = require("../services/db/postService");
const postQueue_1 = require("../services/queue/postQueue");
const postModel_1 = require("../../features/posts/models/postModel");
class PostWorker {
    constructor() {
        this.postQueue = new postQueue_1.PostQueue('postQueue');
    }
    addPost() {
        this.postQueue.processQueue(this.createPost);
    }
    updatePost(postId) {
        this.postQueue.processQueue(this.updatePostFn(postId));
    }
    deletePost() {
        console.log('macho here it gets');
        this.postQueue.processQueue(this.deletePostFn);
    }
    prepareQueueForCreation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.postQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForUpdation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.postQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForDeletion(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('hereee');
            yield this.postQueue.addToQueue(postId);
            return this;
        });
    }
    createPost(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = job.data;
            yield postModel_1.postModel.create(data);
        });
    }
    updatePostFn(postId) {
        return function (job) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = job.data;
                yield postService_1.PostService.updatePostDb(postId, data);
            });
        };
    }
    deletePostFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = job.data;
            yield postService_1.PostService.deletePostsDb(postId);
        });
    }
}
exports.PostWorker = PostWorker;
