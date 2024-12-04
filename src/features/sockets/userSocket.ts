import { Server as socketServer, Socket } from 'socket.io';

export let userSocket: socketServer;

export const userMap: Record<string, string> = {};
let users: string[] = [];

export class UserSocket {
  constructor(private io: socketServer) {
    this.io = io;
    userSocket = io;
  }

  private removeItemFromUserMap(socketId: string) {
    if (Object.values(userMap).includes(socketId)) {
      const result: [string, string] = Object.entries(userMap).find((user) => user[1] === socketId)!;
      return result[0];
    }
  }

  private addUser(userName: string) {
    users.push(userName);
    users = [...new Set(users)];
  }

  private removeUser(userName: string) {
    users = users.filter((user) => user !== userName);
  }

  listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('setup', (userName: string) => {
        console.log(userMap, !userMap);
        if (!userMap[userName]) {
          userMap[userName] = socket.id;
          this.addUser(userName);
          this.io.emit('online users', users);
        }

        this.io.emit('online users', users);
      });

      socket.on('disconnect', () => {
        const userName = this.removeItemFromUserMap(socket.id);
        if (!userName) return;

        delete userMap[userName];
        this.removeUser(userName);
        this.io.emit('online users', users);
      });
    });
  }
}
