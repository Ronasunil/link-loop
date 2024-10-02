import { Router as expressRouter } from 'express';

import { Middlewares } from '@global/helpers/middlewares';
import { chatDeletionSchema, chatReactionSchema, chatSchema, userChatSchema } from '@chat/schemas/chatSchema';
import { create } from '@chat/controller/create';
import { destroy } from '@chat/controller/destroy';
import { get } from '@chat/controller/get';
import { update } from '@chat/controller/update';

class Routes {
  private router: expressRouter;

  constructor() {
    this.router = expressRouter();
  }

  routes(): expressRouter {
    this.router.post(
      '/chats/message',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(chatSchema),
      create.chat
    );

    this.router.post(
      '/chats/userChats',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(userChatSchema),
      create.chatUser
    );

    this.router.get(
      '/conversationList/:userId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      get.conversationList
    );

    this.router.get('/chat/:conversationId', Middlewares.validateToken, Middlewares.currentUserCheck, get.chat);

    this.router.patch(
      '/chat/seen/:conversationId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      update.markMessageAsSeen
    );

    this.router.patch(
      '/chat/:conversationId/messages/:messageId',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(chatDeletionSchema),
      update.markMessageAsDeleted
    );

    this.router.patch(
      '/chat/:conversationId/messages/:messageId/reaction',
      Middlewares.validateToken,
      Middlewares.currentUserCheck,
      Middlewares.joiValidation(chatReactionSchema),
      update.addReaction
    );

    this.router.delete('/chats/userChats', Middlewares.validateToken, Middlewares.currentUserCheck, destroy.userChats);

    return this.router;
  }
}

export const chatRouter = new Routes();
