import express, { Application } from 'express';
import 'express-async-errors';
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
import { ImageSocket } from './features/sockets/imageSocket';
import { ChatSocket } from './features/sockets/chatSocket';
mongodb+srv://rona:qS2G5POIhY6IlZkS@cluster0.gkbu53p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
export class Server {
  private PORT = config.PORT;

  constructor() {
    const app = express();
    const db = new Database();
    const application = new App(app);

    db.startDb();
    db.startCache();
    application.start();
    this.handleExit();
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
      console.log(`Server start listening on port ${this.PORT} with pid of ${process.pid}`);
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
    const imageSocket = new ImageSocket(server);
    const chatSocket = new ChatSocket(server);

    postSocket.listen();
    followerScoket.listen();
    imageSocket.listen();
    chatSocket.listen();
    notificationSocket.listen(server);
  }

  private handleExit() {
    process.on('uncaughtException', (err) => {
      console.log(`Uncaught error:${err}`);
      process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
      console.log(`Uncaught expression ${err}`);
      process.exit(2);
    });

    process.on('SIGTERM', () => {
      console.log('Caught sigterm');
      process.exit(2);
    });

    process.on('SIGINT', () => {
      console.log('Caught sigint');
      process.exit(2);
    });
  }
}

new Server();
