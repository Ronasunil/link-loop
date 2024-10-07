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
exports.destory = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const postCache_1 = require("../../../shared/services/redis/postCache");
const postWorker_1 = require("../../../shared/workers/postWorker");
const errorHandler_1 = require("../../../shared/global/helpers/errorHandler");
const postService_1 = require("../../../shared/services/db/postService");
class Destroy {
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { postId } = req.params;
            const authId = ((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.authId.toString()) || '';
            const userPostsCache = yield postCache_1.postCache.getUsersPost(authId);
            const userPosts = userPostsCache.length ? userPostsCache : yield postService_1.PostService.getUserPostsDb(authId);
            if (!userPosts.includes(`post:${postId}`))
                throw new errorHandler_1.BadRequestError('Something went wrong');
            yield postCache_1.postCache.deletePost(postId, authId);
            const postWorker = yield new postWorker_1.PostWorker().prepareQueueForDeletion(postId);
            postWorker.deletePost();
            res.status(http_status_codes_1.default.NO_CONTENT).json({});
        });
    }
}
exports.destory = new Destroy();
