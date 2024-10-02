import { ChatService } from '@services/db/chatService';
import { ChatQueue } from '@services/queue/chatQueue';
import { chatAttrs, deleteJob, reactionJob } from '@utils/features/chat/interfaces/chatInterface';
import { Job } from 'bullmq';

export class ChatWorker {
  private chatQueue = new ChatQueue('chatQueue');
  private chatUpdationQueue = new ChatQueue('chatUpdationQueue');
  private chatDeletionQueue = new ChatQueue('chatDeletionQueue');
  private chatReactionQueue = new ChatQueue('chatReactionQueue');

  async prepareQueueForChatCreation(data: chatAttrs): Promise<this> {
    await this.chatQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForChatUpdation(conversationId: string): Promise<this> {
    await this.chatUpdationQueue.addToQueue(conversationId);
    return this;
  }

  async prepareQueueForDeletion(data: deleteJob): Promise<this> {
    await this.chatDeletionQueue.addToQueue(data);
    return this;
  }

  async prepareQueueForChatReaction(data: reactionJob): Promise<this> {
    this.chatReactionQueue.addToQueue(data);
    return this;
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

  private async addChatFn(job: Job) {
    const data = job.data as chatAttrs;
    await ChatService.addChatDb(data);
  }

  private async updateChatFn(job: Job) {
    const conversationId = job.data as string;

    await ChatService.markMessageSeen(conversationId);
  }

  private async deleteChatFn(job: Job) {
    const { messageId, type } = job.data as deleteJob;

    await ChatService.markMessageDeleted(messageId, type);
  }

  private async addReactionFn(job: Job) {
    const { messageId, reactionType, senderName } = job.data as reactionJob;

    await ChatService.addReaction(messageId, reactionType, senderName);
  }
}
