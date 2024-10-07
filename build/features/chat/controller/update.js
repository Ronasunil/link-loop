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
exports.update = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const chatCache_1 = require("../../../shared/services/redis/chatCache");
const chatWorker_1 = require("../../../shared/workers/chatWorker");
class Update {
    markMessageAsSeen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conversationId } = req.params;
            const updatedMessage = yield chatCache_1.chatCache.markMessageSeen(conversationId);
            const chatWorker = yield new chatWorker_1.ChatWorker().prepareQueueForChatUpdation(conversationId);
            chatWorker.updateChat();
            res.status(http_status_codes_1.default.OK).json({ message: 'Updated  message', chat: updatedMessage });
        });
    }
    markMessageAsDeleted(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type } = req.body;
            const { messageId, conversationId } = req.params;
            const chats = yield chatCache_1.chatCache.markMessageAsDeleted(conversationId, messageId, type);
            const chatWorker = yield new chatWorker_1.ChatWorker().prepareQueueForDeletion({ messageId, type });
            chatWorker.deleteChat();
            res.status(http_status_codes_1.default.OK).json({ message: 'Message deleted', chats });
        });
    }
    addReaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, conversationId } = req.params;
            const { type } = req.body;
            const senderName = req.currentUser.userName;
            const chat = yield chatCache_1.chatCache.addReaction(conversationId, messageId, type, senderName);
            const chatWorker = yield new chatWorker_1.ChatWorker().prepareQueueForChatReaction({
                messageId,
                reactionType: type,
                senderName,
            });
            chatWorker.addReaction();
            res.status(http_status_codes_1.default.OK).json({ message: 'Reaction added', chat });
        });
    }
}
exports.update = new Update();
