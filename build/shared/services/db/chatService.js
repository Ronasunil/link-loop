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
exports.ChatService = void 0;
const notificationModel_1 = require("../../../features/notification/model/notificationModel");
const userCache_1 = require("../redis/userCache");
const chatModel_1 = require("../../../features/chat/models/chatModel");
const converstionModel_1 = require("../../../features/chat/models/converstionModel");
const chatSocket_1 = require("../../../features/sockets/chatSocket");
class ChatService {
    static addChatDb(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, reciverId, conversationId } = data;
            const conversation = yield converstionModel_1.conversationModel.findById(conversationId);
            if (!conversation)
                yield converstionModel_1.conversationModel.create({ senderId, receiverId: reciverId, _id: conversationId });
            yield chatModel_1.chatModel.create(data);
            console.log(reciverId);
            // notification for sending message
            const user = yield userCache_1.userCache.getUser(reciverId);
            if (user.userSettings.notificationSettings.onMessage && !data.isRead) {
                const notification = new notificationModel_1.notificationModel();
                const notificationData = yield ChatService.prototype.getNoficationData(data, user);
                const userTo = yield notification.insertNotification(notificationData);
                chatSocket_1.chatSocket.emit('added notification', notificationData, { userTo });
            }
        });
    }
    static markMessageSeen(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield chatModel_1.chatModel.find({ isRead: false });
            yield chatModel_1.chatModel.updateMany({ conversationId, isRead: false }, { $set: { isRead: true } }, { runValidators: true });
            return chats.map((chat) => {
                const plainChat = chat.toObject();
                plainChat.isRead = true;
                return plainChat;
            });
        });
    }
    static markMessageDeleted(messageId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === 'deleteForme')
                yield chatModel_1.chatModel.findByIdAndUpdate(messageId, { deleteForMe: true }, { runValidators: true, new: true });
            else
                yield chatModel_1.chatModel.findByIdAndUpdate(messageId, { deleteForEveryone: true }, { new: true });
        });
    }
    static addReaction(messageId, reactionType, senderName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chatModel_1.chatModel.findByIdAndUpdate(messageId, { $pull: { reaction: { senderName } } });
            yield chatModel_1.chatModel.findByIdAndUpdate(messageId, { $push: { reaction: { senderName, type: reactionType } } }, { new: true, runValidators: true });
        });
    }
    static getChat(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatModel_1.chatModel.find({ conversationId });
        });
    }
    static getConversationList(senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(senderId, 'sender');
            const chatList = [];
            const conversationList = yield converstionModel_1.conversationModel.find({
                $or: [{ senderId: senderId }, { receiverId: senderId }],
            });
            for (const conversation of conversationList) {
                const { _id: conversationId } = conversation;
                const messages = yield chatModel_1.chatModel.find({ conversationId });
                const lastMessage = messages[messages.length - 1];
                chatList.push(lastMessage);
            }
            return chatList;
        });
    }
    getNoficationData(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield userCache_1.userCache.getUser(data.senderId);
            return {
                chat: JSON.stringify(data),
                comment: '',
                createdItemId: data._id,
                entityId: data._id,
                imageId: '',
                imageVersion: '',
                message: `${user.name} sent you a message`,
                notificationType: 'chat',
                post: '',
                reaction: '',
                read: false,
                userFrom: data.senderId,
                userTo: data.reciverId,
                profileImg: sender.profileImg,
                createdAt: new Date(),
            };
        });
    }
}
exports.ChatService = ChatService;
