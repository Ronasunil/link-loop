import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { ChatService } from '@services/db/chatService';
import { chatCache } from '@services/redis/chatCache';

class Get {
  async conversationList(req: Request, res: Response) {
    const { userId } = req.params as { userId: string };

    const cacheConversationList = await chatCache.getConversation(userId);
    const conversationList = cacheConversationList.length
      ? cacheConversationList
      : await ChatService.getConversationList(userId);

    res.status(httpStatus.OK).json({ message: 'Conversations', conversationList });
  }

  async chat(req: Request, res: Response) {
    const { conversationId } = req.params as { conversationId: string };

    const cacheChat = await chatCache.getChatByConversationId(conversationId);
    const chat = cacheChat.length ? cacheChat : await ChatService.getChat(conversationId);

    res.status(httpStatus.OK).json({ message: 'Chats', chat });
  }
}

export const get = new Get();
