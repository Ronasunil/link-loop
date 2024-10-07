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
exports.ReactionService = void 0;
const errorHandler_1 = require("../../global/helpers/errorHandler");
const notificationModel_1 = require("../../../features/notification/model/notificationModel");
const postModel_1 = require("../../../features/posts/models/postModel");
const reactionModel_1 = require("../../../features/reactions/models/reactionModel");
const userCache_1 = require("../redis/userCache");
const notificationSocket_1 = require("../../../features/sockets/notificationSocket");
class ReactionService {
    static addReactionDb(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, authId, reactionType, userFrom, userTo, userName } = data;
            const reaction = yield reactionModel_1.reactionModel.findOne({ postId, authId });
            const user = yield userCache_1.userCache.getUser(userTo);
            if (reaction)
                return this.updateReactionDb(reaction._id, data);
            yield reactionModel_1.reactionModel.create(data);
            yield postModel_1.postModel.findByIdAndUpdate(postId, { $inc: { totalReaction: 1, [`reactions.${reactionType}`]: 1 } });
            if (user && user.userSettings.notificationSettings.onLike && userTo !== userFrom) {
                // create notification
                const notification = new notificationModel_1.notificationModel();
                const notificationData = ReactionService.prototype.getNotificationData(user, reaction, userName);
                yield notification.insertNotification(notificationData);
                // emit socket notification
                notificationSocket_1.notificationSocket.emit('added notification', notificationData, { userTo: userTo });
            }
        });
    }
    getNotificationData(user, reaction, userName) {
        return {
            comment: '',
            createdAt: new Date(),
            createdItemId: reaction._id.toString(),
            entityId: user._id.toString(),
            imageId: '',
            imageVersion: '',
            chat: '',
            message: `${userName} started following you`,
            notificationType: 'reaction',
            post: '',
            reaction: '',
            read: false,
            userFrom: reaction.userFrom,
            userTo: reaction.userTo,
        };
    }
    static updateReactionDb(reactionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reactionType, postId, authId } = data;
            const reaction = (yield reactionModel_1.reactionModel.findById(reactionId));
            const prevReaction = reaction.reactionType;
            if (reactionType === prevReaction) {
                yield reactionModel_1.reactionModel.findByIdAndDelete(reactionId);
                yield postModel_1.postModel.findByIdAndUpdate(postId, { $inc: { totalReaction: -1, [`reactions.${reactionType}`]: -1 } }, { new: true, runValidators: true });
                return;
            }
            yield reactionModel_1.reactionModel.findOneAndUpdate({ postId, authId }, { reactionType });
            yield postModel_1.postModel.findByIdAndUpdate(postId, {
                $inc: { [`reactions.${reactionType}`]: 1, [`reactions.${prevReaction}`]: -1 },
            });
        });
    }
    static getReactionByPostId(postId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const reactions = yield reactionModel_1.reactionModel.find({ postId }).skip(skip).limit(limit);
            if (!reactions)
                throw new errorHandler_1.NotFoundError(`No reaction found`);
            return reactions;
        });
    }
}
exports.ReactionService = ReactionService;
