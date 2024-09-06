import { followerData } from '@follower/interfaces/followerInterface';
import { Socket, Server as socketServer } from 'socket.io';

export let followerSocketIo: socketServer;

export class FollowerSocket {
  constructor(private io: socketServer) {
    followerSocketIo = this.io;
  }

  listen() {
    this.io.on('connection', (socket: Socket) => {
      console.log('Follower socket handler');
      socket.on('unfollow user', (data: followerData) => {
        this.io.emit('remove following', data);
      });
    });
  }
}
