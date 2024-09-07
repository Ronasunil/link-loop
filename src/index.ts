import express, { Application } from 'express';
import http from 'http';
import { Database } from '@utils/db';

import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Socket, Server as socketServer } from 'socket.io';
import { config } from './config';
import { App } from './app';
import { PostSocket } from './features/sockets/postSocket';
import { FollowerSocket } from './features/sockets/followerSocket';
import { NotificationSocket } from './features/sockets/notificationSocket';

export class Server {
  private PORT = config.PORT;

  constructor() {
    const app = express();
    const db = new Database();
    const application = new App(app);

    db.startDb();
    db.startCache();
    application.start();
    this.startServer(app);
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new http.Server(app);
      this.httpServer(httpServer);
      const io = await this.createSocketConnection(httpServer);
      this.socketConnections(io);
      config.cloudinaryConfig();
    } catch (err) {
      console.error(err);
    }
  }

  private httpServer(httpServer: http.Server): void {
    httpServer.listen(this.PORT, () => {
      console.log(`Server start listening on port ${this.PORT}`);
    });
  }

  private async createSocketConnection(httpServer: http.Server): Promise<socketServer> {
    const io: socketServer = new socketServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      },
    });

    const pubClient = createClient({ url: config.REDIS_CLIENT });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    console.log('socket.io connected to server');

    io.adapter(createAdapter(pubClient, subClient));

    return io;
  }

  private socketConnections(server: socketServer) {
    const postSocket = new PostSocket(server);
    const followerScoket = new FollowerSocket(server);
    const notificationSocket = new NotificationSocket();

    postSocket.listen();
    followerScoket.listen();
    notificationSocket.listen(server);
  }
}

new Server();
