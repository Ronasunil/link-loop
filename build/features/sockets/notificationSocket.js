"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSocket = exports.notificationSocket = void 0;
class NotificationSocket {
    listen(io) {
        exports.notificationSocket = io;
    }
}
exports.NotificationSocket = NotificationSocket;
