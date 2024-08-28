import { Server as socketServer, Socket } from 'socket.io';

export let postSocketIo: socketServer;

export class PostSocket {
  constructor(private io: socketServer) {
    postSocketIo = this.io;
  }

  listen() {
    this.io.on('connection', () => {
      console.log('Post socket handler');
    });
  }
}
