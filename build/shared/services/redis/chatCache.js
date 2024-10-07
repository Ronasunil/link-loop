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
exports.chatCache = void 0;
const lodash_1 = require("lodash");
const baseCache_1 = require("./baseCache");
class ChatCache extends baseCache_1.BaseCache {
    constructor() {
        super();
    }
    addChat(conversationId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatsJson = (yield this.client.hget('chats', conversationId)) || JSON.stringify([]);
            const chats = JSON.parse(chatsJson);
            chats.unshift(data);
            this.client.hset('chats', conversationId, JSON.stringify(chats));
        });
    }
    getChatByConversationId(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatsJson = (yield this.client.hget('chats', conversationId)) || JSON.stringify([]);
            const chats = JSON.parse(chatsJson);
            return chats;
        });
    }
    markMessageSeen(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield this.getChatByConversationId(conversationId);
            const updatedChat = chats.map((chat) => (!chat.isRead ? Object.assign(Object.assign({}, chat), { isRead: true }) : chat));
            this.client.hset('chats', conversationId, JSON.stringify(updatedChat));
            return updatedChat;
        });
    }
    markMessageAsDeleted(conversationId, messageId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield this.getChatByConversationId(conversationId);
            let updatedChat;
            if (type === 'deleteForme')
                updatedChat = chats.map((chat) => (chat._id === messageId ? Object.assign(Object.assign({}, chat), { deleteForMe: true }) : chat));
            else
                updatedChat = chats.map((chat) => chat._id === messageId ? Object.assign(Object.assign({}, chat), { deleteForMe: true, deleteForEveryone: true }) : chat);
            yield this.client.hset('chats', conversationId, JSON.stringify(updatedChat));
            return updatedChat;
        });
    }
    addReaction(conversationId, messageId, reactionType, senderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield this.getChatByConversationId(conversationId);
            const chatReaction = (yield this.getReaction(conversationId, messageId)) || [];
            if (chatReaction === null || chatReaction === void 0 ? void 0 : chatReaction.find((reac) => reac.senderName == senderName)) {
                (0, lodash_1.remove)(chatReaction, (reac) => reac.senderName === senderName);
            }
            chatReaction === null || chatReaction === void 0 ? void 0 : chatReaction.push({ senderName, type: reactionType });
            const updatedChat = chats.map((chat) => (chat._id === messageId ? Object.assign(Object.assign({}, chat), { reaction: chatReaction }) : chat));
            yield this.client.hset('chats', conversationId, JSON.stringify(updatedChat));
            return updatedChat;
        });
    }
    getReaction(conversationId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield this.getChatByConversationId(conversationId);
            const message = chats.find((chat) => chat._id === messageId);
            return message === null || message === void 0 ? void 0 : message.reaction;
        });
    }
    removeUserChats(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.hdel('userChats', identifier);
        });
    }
    addUserChats(users) {
        return __awaiter(this, void 0, void 0, function* () {
            // note adding user chat  is by first userid +  second userid
            const userOneId = users.userOne._id;
            const userTwoId = users.userTwo._id;
            const userChat = yield this.client.hget('userChats', `${userOneId}:${userTwoId}`);
            if (userChat)
                return;
            yield this.client.hset('userChats', `${userOneId}:${userTwoId}`, JSON.stringify(users));
        });
    }
    getUserChat(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const userChatJson = yield this.client.hget('userChats', identifier);
            if (!userChatJson)
                return null;
            return JSON.parse(userChatJson);
        });
    }
    getAllUserChats() {
        return __awaiter(this, void 0, void 0, function* () {
            const userChats = yield this.client.hgetall('userChats');
            return Object.values(userChats).map((chat) => JSON.parse(chat));
        });
    }
    addConversation(senderId, receiverId, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderConversation = yield this.client.lrange(`conversations:${senderId}`, 0, -1);
            const reciverConversation = yield this.client.lrange(`conversations:${receiverId}`, 0, -1);
            console.log(senderConversation, reciverConversation);
            const promises = [];
            const isSenderExist = senderConversation.some((conv) => JSON.parse(conv).senderId === senderId &&
                JSON.parse(conv).receiverId === receiverId &&
                JSON.parse(conv).conversationId === conversationId);
            const isReciverExist = reciverConversation.some((conv) => JSON.parse(conv).receiverId === receiverId &&
                JSON.parse(conv).senderId === senderId &&
                JSON.parse(conv).conversationId === conversationId);
            console.log(isSenderExist, isReciverExist);
            if (!isSenderExist) {
                promises.push(this.client.lpush(`conversations:${senderId}`, JSON.stringify({ conversationId, receiverId, senderId })));
            }
            if (!isReciverExist) {
                promises.push(this.client.lpush(`conversations:${receiverId}`, JSON.stringify({ conversationId, senderId, receiverId })));
            }
            yield Promise.all(promises);
        });
    }
    getConversation(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatList = [];
            const conversationsJson = yield this.client.lrange(`conversations:${key}`, 0, -1);
            for (const conversation of conversationsJson) {
                const con = JSON.parse(conversation);
                const chat = yield this.getChatByConversationId(con.conversationId);
                console.log(chat);
                const lastMessage = chat[0];
                chatList.push(lastMessage);
            }
            return chatList;
        });
    }
}
exports.chatCache = new ChatCache();
