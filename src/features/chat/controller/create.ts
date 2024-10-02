import { Response } from 'express';

import httpStatus from 'http-status-codes';

import { chatAttrs, reqForAddingChatUsers, reqForChat } from '../interfaces/chatInterface';
import { Helpers } from '@global/helpers/helpers';
import { userCache } from '@services/redis/userCache';
import { chatCache } from '@services/redis/chatCache';
import { chatSocket } from '@utils/features/sockets/chatSocket';
import { cloudinaryUploader } from '@global/helpers/cloudinary';
import { BadRequestError } from '@global/helpers/errorHandler';
import { config } from '@utils/config';
import { ChatWorker } from '@workers/chatWorker';

class Create {
  async chat(req: reqForChat, res: Response) {
    const chat = await Create.prototype.chatData(req);

    chatSocket.emit('message', chat);
    chatSocket.emit('chat list', chat);

    await chatCache.addChat(chat.conversationId, chat);
    await chatCache.addConversation(chat.senderId, chat.reciverId, chat.conversationId);

    const chatWorker = await new ChatWorker().prepareQueueForChatCreation(chat);
    chatWorker.addChat();

    res.status(httpStatus.OK).json({ message: 'Chat sent' });
  }

  async chatUser(req: reqForAddingChatUsers, res: Response) {
    const { userOne, userTwo } = req.body;
    const user_1 = await userCache.getUser(userOne);
    const user_2 = await userCache.getUser(userTwo);
    await chatCache.addUserChats({ userOne: user_1, userTwo: user_2 });

    res.status(httpStatus.OK).json({ message: 'Added users to chat' });
  }

  private async chatData(req: reqForChat): Promise<chatAttrs> {
    const chatId = Helpers.createObjectId().toString();
    const { conversationId, gif, image, message, reciverId, reciverName, reciverProfileImg } = req.body;

    const conversationObjectId = !conversationId ? Helpers.createObjectId().toHexString() : conversationId;
    let imgInChat = '';

    if (image) {
      const result = await cloudinaryUploader.imageUpload(image);
      if (!result?.public_id) throw new BadRequestError('Please try again');
      imgInChat = `${config.CLOUDINARY_BASE_URL}${result.version}/${result.public_id}`;
    }

    const user = await userCache.getUser(req.currentUser!._id.toString());
    console.log(user.profileImg, user);
    const chatData: chatAttrs = {
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
  }
}

export const create = new Create();
