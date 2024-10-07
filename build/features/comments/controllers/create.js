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
exports.comment = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const helpers_1 = require("../../../shared/global/helpers/helpers");
const commentCache_1 = require("../../../shared/services/redis/commentCache");
const commentWorker_1 = require("../../../shared/workers/commentWorker");
const postSocket_1 = require("../../../features/sockets/postSocket");
class Comment {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentId = helpers_1.Helpers.createObjectId();
            const commentData = Comment.prototype.commentData(req, commentId);
            postSocket_1.postSocketIo.emit('comment:created', commentData);
            yield commentCache_1.commentCache.addComment(commentData);
            const commentWorker = yield new commentWorker_1.CommentWorker().prepareQueueForCreation(commentData);
            commentWorker.createComment();
            res.status(http_status_codes_1.default.OK).json({ message: 'Comment created successfully', comment: commentData });
        });
    }
    commentData(req, commentId) {
        const { userTo, postId, comment, profilePic } = req.body;
        return {
            userTo,
            authId: req.currentUser.authId.toString(),
            postId,
            comment,
            _id: commentId,
            createdAt: new Date(),
            userName: req.currentUser.userName,
            profilePic,
            userFrom: req.currentUser._id.toString(),
        };
    }
}
exports.comment = new Comment();
