"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageSocket = exports.imageSocket = void 0;
class ImageSocket {
    constructor(io) {
        this.io = io;
        exports.imageSocket = io;
    }
    listen() {
        this.io.on('connection', (socket) => {
            console.log('image socket handler');
        });
    }
}
exports.ImageSocket = ImageSocket;
