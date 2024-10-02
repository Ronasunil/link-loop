import { notification } from '@notification/interfaces/notificationInterface';
import { notificationModel } from '@notification/model/notificationModel';

import { userCache } from '@services/redis/userCache';
import { chatAttrs, chatDoc, deleteType } from '@utils/features/chat/interfaces/chatInterface';
import { chatModel } from '@utils/features/chat/models/chatModel';
import { conversationModel } from '@utils/features/chat/models/converstionModel';
import { chatSocket } from '@utils/features/sockets/chatSocket';
import { redisUserAttrs } from '@utils/features/users/interface/user.interface';

export class ChatService {
  static async addChatDb(data: chatAttrs) {
    const { senderId, reciverId, conversationId } = data;
    const conversation = await conversationModel.findById(conversationId);
    if (!conversation) await conversationModel.create({ senderId, receiverId: reciverId, _id: conversationId });

    await chatModel.create(data);
    console.log(reciverId);
    // notification for sending message
    const user = await userCache.getUser(reciverId);
    if (user.userSettings.notificationSettings.onMessage && !data.isRead) {
      const notification = new notificationModel();
      const notificationData = await ChatService.prototype.getNoficationData(data, user);
      const userTo = await notification.insertNotification(notificationData);

      chatSocket.emit('added notification', notificationData, { userTo });
    }
  }

  static async markMessageSeen(conversationId: string): Promise<chatDoc[]> {
    const chats = await chatModel.find({ isRead: false });
    await chatModel.updateMany({ conversationId, isRead: false }, { $set: { isRead: true } }, { runValidators: true });

    return chats.map((chat) => {
      const plainChat = chat.toObject();
      plainChat.isRead = true;
      return plainChat;
    });
  }

  static async markMessageDeleted(messageId: string, type: deleteType) {
    if (type === 'deleteForme')
      await chatModel.findByIdAndUpdate(messageId, { deleteForMe: true }, { runValidators: true, new: true });
    else await chatModel.findByIdAndUpdate(messageId, { deleteForEveryone: true }, { new: true });
  }

  static async addReaction(messageId: string, reactionType: string, senderName: string) {
    await chatModel.findByIdAndUpdate(messageId, { $pull: { reaction: { senderName } } });

    await chatModel.findByIdAndUpdate(
      messageId,
      { $push: { reaction: { senderName, type: reactionType } } },
      { new: true, runValidators: true }
    );
  }

  static async getChat(conversationId: string): Promise<chatDoc[]> {
    return await chatModel.find({ conversationId });
  }

  static async getConversationList(senderId: string): Promise<chatDoc[]> {
    console.log(senderId, 'sender');
    const chatList: chatDoc[] = [];
    const conversationList = await conversationModel.find({
      $or: [{ senderId: senderId }, { receiverId: senderId }],
    });

    for (const conversation of conversationList) {
      const { _id: conversationId } = conversation;
      const messages = await chatModel.find({ conversationId });
      const lastMessage = messages[messages.length - 1];
      chatList.push(lastMessage);
    }

    return chatList;
  }

  async getNoficationData(data: chatAttrs, user: redisUserAttrs): Promise<notification> {
    const sender = await userCache.getUser(data.senderId);
    return {
      chat: JSON.stringify(data),
      comment: '',
      createdItemId: data._id,
      entityId: data._id,
      imageId: '',
      imageVersion: '',
      message: `${user.name} sent you a message`,
      notificationType: 'chat',
      post: '',
      reaction: '',
      read: false,
      userFrom: data.senderId,
      userTo: data.reciverId,
      profileImg: sender.profileImg,
      createdAt: new Date(),
    };
  }
}
