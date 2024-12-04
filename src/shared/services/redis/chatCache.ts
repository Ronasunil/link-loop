import { remove } from 'lodash';

import {
  chatAttrs,
  chatReaction,
  conversation,
  deleteType,
  messagingUsers,
} from '@utils/features/chat/interfaces/chatInterface';
import { BaseCache } from './baseCache';

class ChatCache extends BaseCache {
  constructor() {
    super();
  }

  async addChat(conversationId: string, data: chatAttrs): Promise<void> {
    const chatsJson = (await this.client.hget('chats', conversationId)) || JSON.stringify([]);
    const chats = JSON.parse(chatsJson) as chatAttrs[];

    chats.push(data);
    this.client.hset('chats', conversationId, JSON.stringify(chats));
  }

  async getChatByConversationId(conversationId: string): Promise<chatAttrs[]> {
    const chatsJson = (await this.client.hget('chats', conversationId)) || JSON.stringify([]);

    const chats = JSON.parse(chatsJson) as chatAttrs[];
    return chats;
  }

  async markMessageSeen(conversationId: string): Promise<chatAttrs[]> {
    const chats = await this.getChatByConversationId(conversationId);
    const updatedChat = chats.map((chat) => (!chat.isRead ? { ...chat, isRead: true } : chat));

    this.client.hset('chats', conversationId, JSON.stringify(updatedChat));
    return updatedChat;
  }

  async markMessageAsDelivered(userId: string): Promise<void> {
    const convIds = await this.client.smembers(`userConversations:${userId}`);
    if (!convIds.length) return;
    const pipeline = this.client.pipeline();

    for (let id of convIds) {
      const chats = await this.getChatByConversationId(id);

      const updatedChats = chats.map((chat) =>
        !chat.isDelivered && chat.reciverId === userId ? { ...chat, isDelivered: true } : chat
      );

      pipeline.hset('chats', id, JSON.stringify(updatedChats));
    }

    await pipeline.exec();
  }

  async markMessageAsDeleted(conversationId: string, messageId: string, type: deleteType): Promise<chatAttrs[]> {
    const chats = await this.getChatByConversationId(conversationId);
    let updatedChat: chatAttrs[];

    if (type === 'deleteForme')
      updatedChat = chats.map((chat) => (chat._id === messageId ? { ...chat, deleteForMe: true } : chat));
    else
      updatedChat = chats.map((chat) =>
        chat._id === messageId ? { ...chat, deleteForMe: true, deleteForEveryone: true } : chat
      );

    await this.client.hset('chats', conversationId, JSON.stringify(updatedChat));
    return updatedChat;
  }

  async addReaction(
    conversationId: string,
    messageId: string,
    reactionType: string,
    senderName: string
  ): Promise<chatAttrs[]> {
    const chats = await this.getChatByConversationId(conversationId);
    const chatReaction = (await this.getReaction(conversationId, messageId)) || [];

    if (chatReaction?.find((reac) => reac.senderName == senderName)) {
      remove(chatReaction, (reac) => reac.senderName === senderName);
    }

    chatReaction?.push({ senderName, type: reactionType });

    const updatedChat = chats.map((chat) => (chat._id === messageId ? { ...chat, reaction: chatReaction } : chat));

    await this.client.hset('chats', conversationId, JSON.stringify(updatedChat));
    return updatedChat;
  }

  async getReaction(conversationId: string, messageId: string): Promise<chatReaction[] | undefined> {
    const chats = await this.getChatByConversationId(conversationId);
    const message = chats.find((chat) => chat._id === messageId);

    return message?.reaction;
  }

  async removeUserChats(identifier: string): Promise<void> {
    await this.client.hdel('userChats', identifier);
  }

  async addUserChats(users: messagingUsers) {
    // note adding user chat  is by first userid +  second userid

    const userOneId = users.userOne._id;
    const userTwoId = users.userTwo._id;

    const userChat = await this.client.hget('userChats', `${userOneId}:${userTwoId}`);
    if (userChat) return;

    await this.client.hset('userChats', `${userOneId}:${userTwoId}`, JSON.stringify(users));
  }

  async getUserChat(identifier: string): Promise<messagingUsers | null> {
    const userChatJson = await this.client.hget('userChats', identifier);
    if (!userChatJson) return null;

    return JSON.parse(userChatJson) as messagingUsers;
  }

  async getAllUserChats(): Promise<messagingUsers[]> {
    const userChats = await this.client.hgetall('userChats');

    return Object.values(userChats).map((chat) => JSON.parse(chat) as messagingUsers);
  }

  async addConversation(senderId: string, receiverId: string, conversationId: string) {
    const senderConversation = await this.client.lrange(`conversationsId:${senderId}`, 0, -1);
    const reciverConversation = await this.client.lrange(`conversationsId:${receiverId}`, 0, -1);

    const promises: Promise<number>[] = [];

    const isSenderExist = senderConversation.some(
      (conv) =>
        (JSON.parse(conv).senderId === senderId &&
          JSON.parse(conv).receiverId === receiverId &&
          JSON.parse(conv).conversationId === conversationId) ||
        JSON.parse(conv).conversationId === conversationId
    );
    const isReciverExist = reciverConversation.some(
      (conv) =>
        (JSON.parse(conv).receiverId === receiverId &&
          JSON.parse(conv).senderId === senderId &&
          JSON.parse(conv).conversationId === conversationId) ||
        JSON.parse(conv).conversationId === conversationId
    );

    if (!isSenderExist) {
      promises.push(
        this.client.lpush(`conversationsId:${senderId}`, JSON.stringify({ conversationId, receiverId, senderId }))
      );
    }

    if (!isReciverExist) {
      promises.push(
        this.client.lpush(`conversationsId:${receiverId}`, JSON.stringify({ conversationId, senderId, receiverId }))
      );
    }

    promises.push(this.client.sadd(`userConversations:${senderId}`, conversationId));
    promises.push(this.client.sadd(`userConversations:${receiverId}`, conversationId));

    await Promise.all(promises);
  }

  async getConversation(key: string): Promise<chatAttrs[]> {
    const chatList: chatAttrs[] = [];
    const conversationsJson = await this.client.lrange(`conversationsId:${key}`, 0, -1);
    console.log(conversationsJson, key);
    for (const conversation of conversationsJson) {
      const con = JSON.parse(conversation) as conversation;

      const chat = await this.getChatByConversationId(con.conversationId);

      const lastMessage = chat[0];

      chatList.push(lastMessage);
    }

    return chatList;
  }
}

export const chatCache = new ChatCache();
