import express from 'express';
import { Database } from './db';
import { Server } from './server';

class App {
  static init() {
    const app = express();
    const db = new Database();
    const server = new Server(app);

    db.startDb();
    server.start();
  }
}

App.init();
