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
exports.create = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const helpers_1 = require("../../../shared/global/helpers/helpers");
const userCache_1 = require("../../../shared/services/redis/userCache");
const chatCache_1 = require("../../../shared/services/redis/chatCache");
const chatSocket_1 = require("../../../features/sockets/chatSocket");
const cloudinary_1 = require("../../../shared/global/helpers/cloudinary");
const errorHandler_1 = require("../../../shared/global/helpers/errorHandler");
const config_1 = require("../../../config");
const chatWorker_1 = require("../../../shared/workers/chatWorker");
class Create {
    chat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield Create.prototype.chatData(req);
            chatSocket_1.chatSocket.emit('message', chat);
            chatSocket_1.chatSocket.emit('chat list', chat);
            yield chatCache_1.chatCache.addChat(chat.conversationId, chat);
            yield chatCache_1.chatCache.addConversation(chat.senderId, chat.reciverId, chat.conversationId);
            const chatWorker = yield new chatWorker_1.ChatWorker().prepareQueueForChatCreation(chat);
            chatWorker.addChat();
            res.status(http_status_codes_1.default.OK).json({ message: 'Chat sent' });
        });
    }
    chatUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userOne, userTwo } = req.body;
            const user_1 = yield userCache_1.userCache.getUser(userOne);
            const user_2 = yield userCache_1.userCache.getUser(userTwo);
            yield chatCache_1.chatCache.addUserChats({ userOne: user_1, userTwo: user_2 });
            res.status(http_status_codes_1.default.OK).json({ message: 'Added users to chat' });
        });
    }
    chatData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatId = helpers_1.Helpers.createObjectId().toString();
            const { conversationId, gif, image, message, reciverId, reciverName, reciverProfileImg } = req.body;
            const conversationObjectId = !conversationId ? helpers_1.Helpers.createObjectId().toHexString() : conversationId;
            let imgInChat = '';
            if (image) {
                const result = yield cloudinary_1.cloudinaryUploader.imageUpload(image);
                if (!(result === null || result === void 0 ? void 0 : result.public_id))
                    throw new errorHandler_1.BadRequestError('Please try again');
                imgInChat = `${config_1.config.CLOUDINARY_BASE_URL}${result.version}/${result.public_id}`;
            }
            const user = yield userCache_1.userCache.getUser(req.currentUser._id.toString());
            console.log(user.profileImg, user);
            const chatData = {
                _id: chatId,
                conversationId: conversationObjectId,
                senderId: user._id.toString(),
                reciverId,
                reciverProfileImg,
                senderProfileImg: user.profileImg,
                reciverName,
                senderName: user.name,
                gif,
                image: imgInChat,
                deleteForEveryone: false,
                deleteForMe: false,
                isRead: false,
                reaction: [],
                message,
                createdAt: new Date(),
            };
            return chatData;
        });
    }
}
exports.create = new Create();
