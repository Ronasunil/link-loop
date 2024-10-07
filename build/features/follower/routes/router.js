"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followerRouter = void 0;
const create_1 = require("../controllers/create");
const destroy_1 = require("../controllers/destroy");
const get_1 = require("../controllers/get");
const userBlockManager_1 = require("../controllers/userBlockManager");
const middlewares_1 = require("../../../shared/global/helpers/middlewares");
const express_1 = require("express");
class Router {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.patch('/users/follow/:followerId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, create_1.follow.followuser);
        this.router.patch('/users/block/:blockUserId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, userBlockManager_1.userBlockManager.block);
        this.router.patch('/users/unblock/:unblockUserId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, userBlockManager_1.userBlockManager.unblock);
        this.router.delete('/users/unfollow/:followerId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, destroy_1.destroy.follow);
        this.router.get('/users/followers/:userId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.userFollowers);
        this.router.get('/users/followees/:userId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.userFollowees);
        return this.router;
    }
}
exports.followerRouter = new Router();
