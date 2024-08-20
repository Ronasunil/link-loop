import express from 'express';
import { Database } from '@utils/db';
import { Server } from '@utils/server';

class App {
  static init() {
    const app = express();
    const db = new Database();
    const server = new Server(app);

    db.startDb();
    db.startCache();
    server.start();
  }
}

App.init();
