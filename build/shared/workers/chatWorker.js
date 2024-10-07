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
exports.ChatWorker = void 0;
const chatService_1 = require("../services/db/chatService");
const chatQueue_1 = require("../services/queue/chatQueue");
class ChatWorker {
    constructor() {
        this.chatQueue = new chatQueue_1.ChatQueue('chatQueue');
        this.chatUpdationQueue = new chatQueue_1.ChatQueue('chatUpdationQueue');
        this.chatDeletionQueue = new chatQueue_1.ChatQueue('chatDeletionQueue');
        this.chatReactionQueue = new chatQueue_1.ChatQueue('chatReactionQueue');
    }
    prepareQueueForChatCreation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chatQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForChatUpdation(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chatUpdationQueue.addToQueue(conversationId);
            return this;
        });
    }
    prepareQueueForDeletion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chatDeletionQueue.addToQueue(data);
            return this;
        });
    }
    prepareQueueForChatReaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.chatReactionQueue.addToQueue(data);
            return this;
        });
    }
    deleteChat() {
        this.chatDeletionQueue.processQueue(this.deleteChatFn);
    }
    updateChat() {
        this.chatUpdationQueue.processQueue(this.updateChatFn);
    }
    addChat() {
        this.chatQueue.processQueue(this.addChatFn);
    }
    addReaction() {
        this.chatReactionQueue.processQueue(this.addReactionFn);
    }
    addChatFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = job.data;
            yield chatService_1.ChatService.addChatDb(data);
        });
    }
    updateChatFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversationId = job.data;
            yield chatService_1.ChatService.markMessageSeen(conversationId);
        });
    }
    deleteChatFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, type } = job.data;
            yield chatService_1.ChatService.markMessageDeleted(messageId, type);
        });
    }
    addReactionFn(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, reactionType, senderName } = job.data;
            yield chatService_1.ChatService.addReaction(messageId, reactionType, senderName);
        });
    }
}
exports.ChatWorker = ChatWorker;
