"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSocket = exports.postSocketIo = void 0;
class PostSocket {
    constructor(io) {
        this.io = io;
        exports.postSocketIo = this.io;
    }
    listen() {
        this.io.on('connection', () => {
            console.log('Post socket handler');
        });
    }
}
exports.PostSocket = PostSocket;
