import { Request, Response } from 'express';

import httpStatus from 'http-status-codes';

import { chatCache } from '@services/redis/chatCache';
import { ChatWorker } from '@workers/chatWorker';
import { reqForMessageDeletion } from '@chat/interfaces/chatInterface';
import { reactionType } from '@reaction/interfaces/reactionInterface';
import { chatSocket } from '@utils/features/sockets/chatSocket';

class Update {
  async markMessageAsSeen(req: Request, res: Response) {
    const { conversationId } = req.params as { conversationId: string };

    const updatedMessage = await chatCache.markMessageSeen(conversationId);

    const chatWorker = await new ChatWorker().prepareQueueForChatUpdation(conversationId);
    chatWorker.updateChat();

    res.status(httpStatus.OK).json({ message: 'Updated  message', chat: updatedMessage });
  }

  async markMessageAsDelivered(req: Request, res: Response) {
    const { userId } = req.params as { userId: string };
    await chatCache.markMessageAsDelivered(userId);

    const chatWorker = await new ChatWorker().prepareQueueForChatDelivered({ userId });
    chatWorker.deliveredChat();

    res.status(httpStatus.OK).json({ message: 'OK' });
  }

  async markMessageAsDeleted(req: reqForMessageDeletion, res: Response) {
    const { type } = req.body;
    const { messageId, conversationId } = req.params as { messageId: string; conversationId: string };

    const chats = await chatCache.markMessageAsDeleted(conversationId, messageId, type);

    chatSocket.emit('delete message', chats, { senderId: chats[0].senderId, reciverId: chats[0].reciverId });
    const chatWorker = await new ChatWorker().prepareQueueForDeletion({ messageId, type });
    chatWorker.deleteChat();

    res.status(httpStatus.OK).json({ message: 'Message deleted', chats });
  }

  async addReaction(req: Request, res: Response) {
    const { messageId, conversationId } = req.params as { messageId: string; conversationId: string };
    const { type } = req.body as { type: reactionType };
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
