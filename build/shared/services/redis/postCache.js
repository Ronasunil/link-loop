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
exports.postCache = void 0;
const baseCache_1 = require("./baseCache");
const errorHandler_1 = require("../../global/helpers/errorHandler");
class PostCache extends baseCache_1.BaseCache {
    constructor() {
        super();
    }
    addPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: postId, authId } = data;
            const postData = JSON.stringify(data);
            yield this.client.set(`post:${postId}`, postData);
            // add postId with associated authId
            yield this.client.sadd(`auth:${authId}`, `post:${postId}`);
            // add all postIds
            yield this.client.sadd('postIds', `posts:${postId}`);
        });
    }
    getPostsByAuthId(authId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = [];
            const postKeys = (yield this.client.smembers(`auth:${authId}`)).slice(skip, limit);
            if (!postKeys.length)
                return [];
            for (const key of postKeys) {
                const post = yield this.client.get(key);
                if (!post)
                    continue;
                posts.push(JSON.parse(post));
            }
            return posts;
        });
    }
    getPostVideosByAuthId(authId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = [];
            const postKeys = (yield this.client.smembers(`auth:${authId}`)).slice(skip, limit);
            if (!postKeys.length)
                return posts;
            for (const key of postKeys) {
                const postJson = yield this.client.get(key);
                if (!postJson)
                    continue;
                const post = JSON.parse(postJson);
                if (post.videoId && post.videoVersion)
                    posts.push(post);
            }
            return posts;
        });
    }
    getPostImagesByAuthId(authId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = [];
            const postKeys = yield this.client.smembers(`auth:${authId}`);
            if (!postKeys.length)
                return [];
            for (const key of postKeys) {
                const postJson = yield this.client.get(key);
                if (!postJson)
                    continue;
                const post = JSON.parse(postJson);
                const postWithImage = post.imageId && post.imageVersion ? post : null;
                if (postWithImage)
                    posts.push(postWithImage);
            }
            return posts.length > 0 ? posts.slice(skip, limit) : [];
        });
    }
    getPost(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.client.get(`post:${identifier}`);
            if (!post)
                return null;
            return JSON.parse(post);
        });
    }
    getAllPost(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = [];
            const postKeys = yield this.client.smembers('postIds');
            if (!postKeys.length)
                return [];
            for (const key of postKeys) {
                const postJson = yield this.client.get(key);
                if (!postJson)
                    continue;
                posts.push(JSON.parse(postJson));
            }
            return posts;
        });
    }
    getUsersPost(authId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPosts = yield this.client.smembers(`auth:${authId}`);
            return userPosts;
        });
    }
    deletePost(postId, authId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.srem(`auth:${authId}`, `post:${postId}`);
            yield this.client.srem('postsIds', `post:${postId}`);
        });
    }
    updatePost(postId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.getPost(postId);
            if (!post)
                throw new errorHandler_1.BadRequestError(`Can't find item`);
            const updatedData = JSON.stringify(Object.assign(Object.assign({}, post), data));
            console.log(data);
            yield this.client.set(`post:${postId}`, updatedData);
            return JSON.parse(updatedData);
        });
    }
    getTotalReaction(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.getPost(postId);
            if (!post)
                throw new errorHandler_1.NotFoundError(`Post based on this id:${postId} is not avialable`);
            return Number.parseInt(`${post.totalReaction}`);
        });
    }
}
exports.postCache = new PostCache();
