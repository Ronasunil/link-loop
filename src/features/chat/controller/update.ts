import { Request, Response } from 'express';

import httpStatus from 'http-status-codes';

import { chatCache } from '@services/redis/chatCache';
import { ChatWorker } from '@workers/chatWorker';
import { reqForMessageDeletion } from '@chat/interfaces/chatInterface';

class Update {
  async markMessageAsSeen(req: Request, res: Response) {
    const { conversationId } = req.params as { conversationId: string };

    const updatedMessage = await chatCache.markMessageSeen(conversationId);

    const chatWorker = await new ChatWorker().prepareQueueForChatUpdation(conversationId);
    chatWorker.updateChat();

    res.status(httpStatus.OK).json({ message: 'Updated  message', chat: updatedMessage });
  }

  async markMessageAsDeleted(req: reqForMessageDeletion, res: Response) {
    const { type } = req.body;
    const { messageId, conversationId } = req.params as { messageId: string; conversationId: string };

    const chats = await chatCache.markMessageAsDeleted(conversationId, messageId, type);

    const chatWorker = await new ChatWorker().prepareQueueForDeletion({ messageId, type });
    chatWorker.deleteChat();

    res.status(httpStatus.OK).json({ message: 'Message deleted', chats });
  }

  async addReaction(req: Request, res: Response) {
    const { messageId, conversationId } = req.params as { messageId: string; conversationId: string };
    const { type } = req.body as { type: string };
    const senderName = req.currentUser!.userName;

    const chat = await chatCache.addReaction(conversationId, messageId, type, senderName);

    const chatWorker = await new ChatWorker().prepareQueueForChatReaction({
      messageId,
      reactionType: type,
      senderName,
    });

    chatWorker.addReaction();

    res.status(httpStatus.OK).json({ message: 'Reaction added', chat });
  }
}

export const update = new Update();
