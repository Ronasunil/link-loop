"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSocket = exports.userMap = exports.userSocket = void 0;
exports.userMap = {};
let users = [];
class UserSocket {
    constructor(io) {
        this.io = io;
        exports.userSocket = io;
    }
    removeItemFromUserMap(socketId) {
        if (Object.values(exports.userMap).includes(socketId)) {
            const result = Object.entries(exports.userMap).find((user) => user[1] === socketId);
            return result[0];
        }
    }
    addUser(userName) {
        users.push(userName);
        users = [...new Set(users)];
    }
    removeUser(userName) {
        users = users.filter((user) => user !== userName);
    }
    listen() {
        this.io.on('connection', (socket) => {
            socket.on('setup', (userName) => {
                if (!exports.userMap[userName]) {
                    exports.userMap[userName] = socket.id;
                    this.addUser(userName);
                    this.io.emit('online users', users);
                }
            });
            socket.on('disconnect', (socketId) => {
                const userName = this.removeItemFromUserMap(socketId);
                if (!userName)
                    return;
                delete exports.userMap[userName];
                this.removeUser(userName);
                this.io.emit('online users', users);
            });
        });
    }
}
exports.UserSocket = UserSocket;
