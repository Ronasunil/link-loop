import { Socket, Server as socketServer } from 'socket.io';
import { senderReciver } from '../chat/interfaces/chatInterface';
import { userMap } from './userSocket';

export let chatSocket: socketServer;

export class ChatSocket {
  constructor(private io: socketServer) {
    chatSocket = io;
  }

  listen() {
    this.io.on('connection', (socket: Socket) => {
      socket.on('join room', (data: senderReciver) => {
        const { senderName, reciverName } = data;
        const senderSocketId = userMap[senderName];
        const reciverSocketId = userMap[reciverName];

        if (!reciverSocketId) return socket.emit('user offline', { message: 'user is offline' });
        socket.join(senderSocketId);
        socket.join(reciverSocketId);
      });
    });
  }
}
