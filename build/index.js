"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const server_1 = require("./server");
class App {
    static init() {
        const app = (0, express_1.default)();
        const db = new db_1.Database();
        const server = new server_1.Server(app);
        db.startDb();
        server.start();
    }
}
App.init();
