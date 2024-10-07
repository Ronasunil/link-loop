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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const postService_1 = require("../../../shared/services/db/postService");
const postCache_1 = require("../../../shared/services/redis/postCache");
const helpers_1 = require("../../../shared/global/helpers/helpers");
class Get {
    posts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pageNo = Number.parseInt(((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || '1');
            const { skip, limit } = helpers_1.Helpers.paginate(pageNo);
            const cachePosts = yield postCache_1.postCache.getAllPost(skip, limit);
            const posts = cachePosts.length ? cachePosts : yield postService_1.PostService.getAllPostsDb(skip, limit);
            res.status(http_status_codes_1.default.OK).json({ posts });
        });
    }
    postsByAuthId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pageNo = Number.parseInt(((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || '1');
            const { skip, limit } = helpers_1.Helpers.paginate(pageNo);
            const { authId } = req.params;
            const cachePosts = yield postCache_1.postCache.getPostsByAuthId(authId, skip, limit);
            console.log(cachePosts, 'pop', authId);
            const posts = cachePosts.length ? cachePosts : yield postService_1.PostService.getPostbyAuthIdDb(authId, skip, limit);
            res.status(http_status_codes_1.default.OK).json({ posts });
        });
    }
    postsWithImageByAuthId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pageNo = Number.parseInt(((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || '1');
            const { skip, limit } = helpers_1.Helpers.paginate(pageNo);
            const { authId } = req.params;
            const cachePosts = yield postCache_1.postCache.getPostImagesByAuthId(authId, skip, limit);
            const posts = cachePosts.length ? cachePosts : yield postService_1.PostService.getPostImagesByAuthIdDb(authId, skip, limit);
            res.status(http_status_codes_1.default.OK).json({ posts });
        });
    }
    postsWithVideosByAuthId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.query;
            const { authId } = req.params;
            const pageNo = Number.parseInt(page || '1');
            const { skip, limit } = helpers_1.Helpers.paginate(pageNo);
            const chachePosts = yield postCache_1.postCache.getPostVideosByAuthId(authId, skip, limit);
            const posts = chachePosts.length ? chachePosts : yield postService_1.PostService.getPostVideoByAuthIdDb(authId, skip, limit);
            res.status(http_status_codes_1.default.OK).json({ message: 'Post with videos', posts });
        });
    }
    postsWithId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const cachePost = yield postCache_1.postCache.getPost(postId);
            const post = cachePost ? cachePost : yield postService_1.PostService.getPostByIdDb(postId);
            res.status(http_status_codes_1.default.OK).json({ post });
        });
    }
}
exports.get = new Get();
