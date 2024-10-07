"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const http_1 = __importDefault(require("http"));
const db_1 = require("./db");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const socket_io_1 = require("socket.io");
const config_1 = require("./config");
const app_1 = require("./app");
const postSocket_1 = require("./features/sockets/postSocket");
const followerSocket_1 = require("./features/sockets/followerSocket");
const notificationSocket_1 = require("./features/sockets/notificationSocket");
const imageSocket_1 = require("./features/sockets/imageSocket");
const chatSocket_1 = require("./features/sockets/chatSocket");
class Server {
    constructor() {
        this.PORT = config_1.config.PORT;
        const app = (0, express_1.default)();
        const db = new db_1.Database();
        const application = new app_1.App(app);
        db.startDb();
        db.startCache();
        application.start();
        this.startServer(app);
    }
    startServer(app) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const httpServer = new http_1.default.Server(app);
                this.httpServer(httpServer);
                const io = yield this.createSocketConnection(httpServer);
                this.socketConnections(io);
                config_1.config.cloudinaryConfig();
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    httpServer(httpServer) {
        httpServer.listen(this.PORT, () => {
            console.log(`Server start listening on port ${this.PORT}`);
        });
    }
    createSocketConnection(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            const io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: '*',
                    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
                },
            });
            const pubClient = (0, redis_1.createClient)({ url: config_1.config.REDIS_CLIENT });
            const subClient = pubClient.duplicate();
            yield Promise.all([pubClient.connect(), subClient.connect()]);
            console.log('socket.io connected to server');
            io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            return io;
        });
    }
    socketConnections(server) {
        const postSocket = new postSocket_1.PostSocket(server);
        const followerScoket = new followerSocket_1.FollowerSocket(server);
        const notificationSocket = new notificationSocket_1.NotificationSocket();
        const imageSocket = new imageSocket_1.ImageSocket(server);
        const chatSocket = new chatSocket_1.ChatSocket(server);
        postSocket.listen();
        followerScoket.listen();
        imageSocket.listen();
        chatSocket.listen();
        notificationSocket.listen(server);
    }
}
exports.Server = Server;
new Server();
