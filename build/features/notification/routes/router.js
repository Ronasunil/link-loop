"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const middlewares_1 = require("../../../shared/global/helpers/middlewares");
const get_1 = require("../controller/get");
const update_1 = require("../controller/update");
const express_1 = require("express");
class Router {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.get('/notifications', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.notification);
        this.router.patch('/notifications/:notificationId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, update_1.update.notification);
        return this.router;
    }
}
exports.notificationRouter = new Router();
