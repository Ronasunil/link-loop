import { Server, Socket } from 'socket.io';

export let imageSocket: Server;

export class ImageSocket {
  constructor(private io: Server) {
    imageSocket = io;
  }

  listen() {
    this.io.on('connection', (socket: Socket) => {
      console.log('image socket handler');
    });
  }
}
