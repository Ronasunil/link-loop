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
exports.CommentService = void 0;
const commentModel_1 = require("../../../features/comments/models/commentModel");
const errorHandler_1 = require("../../global/helpers/errorHandler");
const postModel_1 = require("../../../features/posts/models/postModel");
const userCache_1 = require("../redis/userCache");
const notificationModel_1 = require("../../../features/notification/model/notificationModel");
const notificationSocket_1 = require("../../../features/sockets/notificationSocket");
const mongoose_1 = __importDefault(require("mongoose"));
class CommentService {
    static addCommentDb(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = data;
            const comment = yield commentModel_1.commentModel.create(data);
            const post = yield postModel_1.postModel.findByIdAndUpdate(postId, { $inc: { totalComments: 1 } }, { new: true, runValidators: true });
            const user = yield userCache_1.userCache.getUser(comment.userTo);
            if (user.userSettings.notificationSettings.onComment && comment.userFrom !== comment.userTo && post) {
                // create notification
                const notification = new notificationModel_1.notificationModel();
                const notificationData = CommentService.prototype.getNotificationData(post, comment, user.userName);
                yield notification.insertNotification(notificationData);
                // emit socket notification
                notificationSocket_1.notificationSocket.emit('added notification', notificationData, { userTo: comment.userTo });
            }
        });
    }
    getNotificationData(post, comment, userName) {
        return {
            comment: JSON.stringify(comment),
            createdAt: new Date(),
            createdItemId: comment._id.toString(),
            entityId: comment._id.toString(),
            imageId: post.imageId,
            imageVersion: post.imageVersion,
            message: `${userName} commented on this post`,
            notificationType: 'comment',
            post: JSON.stringify(post),
            chat: '',
            reaction: '',
            read: false,
            userFrom: comment.userFrom.toString(),
            userTo: comment.userTo.toString(),
        };
    }
    static updateCommentDb(postId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield commentModel_1.commentModel.findOneAndUpdate({ postId }, data);
        });
    }
    static deleteCommentDb(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield commentModel_1.commentModel.findOneAndDelete({ postId, _id: commentId });
            yield postModel_1.postModel.findByIdAndUpdate(postId, { $inc: { totalComments: -1 } });
        });
    }
    static getCommentsOfPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield commentModel_1.commentModel.find({ postId });
            return comments;
        });
    }
    static getComment(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentModel_1.commentModel.findOne({ postId, _id: commentId });
            if (!comment)
                throw new errorHandler_1.NotFoundError(`Comment based on this id${commentId} is not found`);
            return comment;
        });
    }
    static getCommentsUserName(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield commentModel_1.commentModel.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(commentId) },
                },
                { $group: { _id: null, names: { $addToSet: 'userName' }, count: { $sum: 1 } } },
                { $project: { _id: 0 } },
            ]);
        });
    }
}
exports.CommentService = CommentService;
