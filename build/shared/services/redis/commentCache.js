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
exports.commentCache = void 0;
const baseCache_1 = require("./baseCache");
const postCache_1 = require("./postCache");
const errorHandler_1 = require("../../global/helpers/errorHandler");
class CommentCache extends baseCache_1.BaseCache {
    constructor() {
        super();
    }
    addComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, postId } = data;
            const commentJson = JSON.stringify(data);
            yield this.client.hset(`comment:${postId}`, _id.toString(), commentJson);
            // increment post total coment  by 1
            const post = yield postCache_1.postCache.getPost(postId);
            if (!post)
                throw new errorHandler_1.NotFoundError(`Post based on this particular id:${postId} not found`);
            const totalCount = post.totalComments + 1;
            yield postCache_1.postCache.updatePost(postId, { totalComments: totalCount });
        });
    }
    updateComment(postId, commentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentJson = yield this.client.hget(`comment:${postId}`, `${commentId}`);
            if (!commentJson)
                throw new errorHandler_1.NotFoundError(`Comment based on this particular id:${commentId} not found`);
            const comment = JSON.parse(commentJson);
            const updatedData = JSON.stringify(Object.assign(Object.assign({}, comment), data));
            this.client.hset(`comment:${postId}`, `${commentId}`, updatedData);
        });
    }
    deleteComment(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentJson = yield this.client.hget(`comment:${postId}`, `${commentId}`);
            if (!commentJson)
                throw new errorHandler_1.NotFoundError(`Comment based on this particular id:${commentId} not found`);
            yield this.client.hdel(`comment:${postId}`, `${commentId}`);
            yield this.client.lrem(`postComment:${postId}`, 1, commentJson);
            // decrement post total coment  by 1
            const post = yield postCache_1.postCache.getPost(postId);
            if (!post)
                throw new errorHandler_1.NotFoundError(`Post based on this particular id:${postId} not found`);
            const commentCount = post.totalComments - 1;
            postCache_1.postCache.updatePost(postId, { totalComments: commentCount });
        });
    }
    getComment(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentJson = yield this.client.hget(`comment:${postId}`, `${commentId}`);
            if (!commentJson)
                throw new errorHandler_1.NotFoundError(`Comment based on this particular id:${commentId} not found`);
            return JSON.parse(commentJson);
        });
    }
    getPostComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentsJson = yield this.client.hgetall(`comment:${postId}`);
            if (!commentsJson)
                throw new errorHandler_1.NotFoundError(`Comment based on this particular id:${postId} not found`);
            const comments = Object.values(commentsJson).map((c) => JSON.parse(c));
            return comments;
        });
    }
    getPostCommentNames(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentsJson = yield this.client.hgetall(`comment:${postId}`);
            if (!commentsJson)
                throw new errorHandler_1.NotFoundError(`Comment based on this particular id:${postId} not found`);
            const names = Object.values(commentsJson).map((c) => {
                const user = JSON.parse(c);
                return user.userName;
            });
            return { names, count: names.length };
        });
    }
}
exports.commentCache = new CommentCache();
