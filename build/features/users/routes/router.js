"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const get_1 = require("../controller/get");
const middlewares_1 = require("../../../shared/global/helpers/middlewares");
const update_1 = require("../controller/update");
const userUpdationSchema_1 = require("../schemas/userUpdationSchema");
class Router {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        // here to work properly page query is needed
        this.router.get('/users', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.getUsers);
        // here to work properly search query is needed
        this.router.get('/users/search', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.searchUsers);
        this.router.get('/users/random', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.getRandomUsers);
        this.router.get('/users/:userId/posts/:authId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.getUserProfileAndPost);
        this.router.patch('/users/me/notification', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(userUpdationSchema_1.notificationSchema), update_1.update.notification);
        this.router.patch('/users/me/socialLinks', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(userUpdationSchema_1.socialMediaSchema), update_1.update.socialLinks);
        this.router.patch('/users/me/basicInfo', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(userUpdationSchema_1.basicInfoSchema), update_1.update.basicInfo);
        return this.router;
    }
}
exports.userRouter = new Router();
