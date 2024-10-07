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
const commentService_1 = require("../../../shared/services/db/commentService");
const commentCache_1 = require("../../../shared/services/redis/commentCache");
class Get {
    allCommentsOfPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const commentsCache = yield commentCache_1.commentCache.getPostComments(postId);
            const comments = commentsCache.length ? commentsCache : yield commentService_1.CommentService.getCommentsOfPost(postId);
            res.status(http_status_codes_1.default.OK).json({ comments, totalComments: comments.length });
        });
    }
    comment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, commentId } = req.params;
            const commentsCache = yield commentCache_1.commentCache.getComment(postId, commentId);
            const comment = commentsCache ? commentsCache : yield commentService_1.CommentService.getComment(postId, commentId);
            res.status(http_status_codes_1.default.OK).json({ comment });
        });
    }
    commentsUserName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const commentsCache = yield commentCache_1.commentCache.getPostCommentNames(postId);
            const comments = commentsCache ? commentsCache : yield commentService_1.CommentService.getCommentsUserName(postId);
            res.status(http_status_codes_1.default.OK).json({ comments });
        });
    }
}
exports.get = new Get();
