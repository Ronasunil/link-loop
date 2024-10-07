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
const chatService_1 = require("../../../shared/services/db/chatService");
const chatCache_1 = require("../../../shared/services/redis/chatCache");
class Get {
    conversationList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const cacheConversationList = yield chatCache_1.chatCache.getConversation(userId);
            const conversationList = cacheConversationList.length
                ? cacheConversationList
                : yield chatService_1.ChatService.getConversationList(userId);
            res.status(http_status_codes_1.default.OK).json({ message: 'Conversations', conversationList });
        });
    }
    chat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conversationId } = req.params;
            const cacheChat = yield chatCache_1.chatCache.getChatByConversationId(conversationId);
            const chat = cacheChat.length ? cacheChat : yield chatService_1.ChatService.getChat(conversationId);
            res.status(http_status_codes_1.default.OK).json({ message: 'Chats', chat });
        });
    }
}
exports.get = new Get();
