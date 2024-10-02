import { Socket, Server as socketServer } from 'socket.io';
import { senderReciver } from '../chat/interfaces/chatInterface';

export let chatSocket: socketServer;

export class ChatSocket {
  constructor(private io: socketServer) {
    chatSocket = io;
  }

  listen() {
    this.io.on('connection', (socket: Socket) => {
      socket.emit('join room', (data: senderReciver) => {
        console.log(data);
      });
    });
  }
}
