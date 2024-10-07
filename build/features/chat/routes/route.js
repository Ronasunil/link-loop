"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../../../shared/global/helpers/middlewares");
const chatSchema_1 = require("../schemas/chatSchema");
const create_1 = require("../controller/create");
const destroy_1 = require("../controller/destroy");
const get_1 = require("../controller/get");
const update_1 = require("../controller/update");
class Routes {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.post('/chats/message', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(chatSchema_1.chatSchema), create_1.create.chat);
        this.router.post('/chats/userChats', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(chatSchema_1.userChatSchema), create_1.create.chatUser);
        this.router.get('/conversationList/:userId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.conversationList);
        this.router.get('/chat/:conversationId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.chat);
        this.router.patch('/chat/seen/:conversationId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, update_1.update.markMessageAsSeen);
        this.router.patch('/chat/:conversationId/messages/:messageId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(chatSchema_1.chatDeletionSchema), update_1.update.markMessageAsDeleted);
        this.router.patch('/chat/:conversationId/messages/:messageId/reaction', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(chatSchema_1.chatReactionSchema), update_1.update.addReaction);
        this.router.delete('/chats/userChats', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, destroy_1.destroy.userChats);
        return this.router;
    }
}
exports.chatRouter = new Routes();
