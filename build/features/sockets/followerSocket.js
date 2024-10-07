"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowerSocket = exports.followerSocketIo = void 0;
class FollowerSocket {
    constructor(io) {
        this.io = io;
        exports.followerSocketIo = this.io;
    }
    listen() {
        this.io.on('connection', (socket) => {
            console.log('Follower socket handler');
            socket.on('unfollow user', (data) => {
                this.io.emit('remove following', data);
            });
        });
    }
}
exports.FollowerSocket = FollowerSocket;
