"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocket = exports.chatSocket = void 0;
const userSocket_1 = require("./userSocket");
class ChatSocket {
    constructor(io) {
        this.io = io;
        exports.chatSocket = io;
    }
    listen() {
        this.io.on('connection', (socket) => {
            socket.on('join room', (data) => {
                const { senderName, reciverName } = data;
                const senderSocketId = userSocket_1.userMap[senderName];
                const reciverSocketId = userSocket_1.userMap[reciverName];
                socket.join(senderSocketId);
                socket.join(reciverSocketId);
            });
        });
    }
}
exports.ChatSocket = ChatSocket;
