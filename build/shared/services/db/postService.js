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
exports.PostService = void 0;
const postModel_1 = require("../../../features/posts/models/postModel");
class PostService {
    static getPostbyAuthIdDb(authId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield postModel_1.postModel.find({ authId }).skip(skip).limit(limit);
            return posts;
        });
    }
    static getPostImagesByAuthIdDb(authId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield postModel_1.postModel.find({ authId, imageId: { $nin: [''] }, imageVersion: { $nin: [''] } });
            return posts;
        });
    }
    static getPostVideoByAuthIdDb(authId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield postModel_1.postModel.find({ authId, videoId: { $nin: [''] }, videoVersion: { $nin: [''] } });
            return posts;
        });
    }
    static getPostByIdDb(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return postModel_1.postModel.findById(id);
        });
    }
    static getAllPostsDb(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postModel_1.postModel.find({}).skip(skip).limit(limit);
        });
    }
    static getUserPostsDb(authId) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersPost = (yield postModel_1.postModel.find({ authId }).select('_id').lean().distinct('_id')).map((id) => `post:${id}`);
            return usersPost;
        });
    }
    static deletePostsDb(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postModel_1.postModel.findByIdAndDelete(postId);
        });
    }
    static updatePostDb(postId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postModel_1.postModel.findByIdAndUpdate(postId, data, { new: true, runValidators: true });
        });
    }
}
exports.PostService = PostService;
