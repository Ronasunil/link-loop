import { Server } from 'socket.io';

export let notificationSocket: Server;

export class NotificationSocket {
  listen(io: Server) {
    notificationSocket = io;
  }
}
