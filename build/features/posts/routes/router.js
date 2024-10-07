"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const middlewares_1 = require("../../../shared/global/helpers/middlewares");
const express_1 = require("express");
const postCreate_1 = require("../controllers/postCreate");
const postSchema_1 = require("../schemas/postSchema");
const get_1 = require("../controllers/get");
const update_1 = require("../controllers/update");
const destroy_1 = require("../controllers/destroy");
class Router {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.post('/post', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(postSchema_1.postSchema), postCreate_1.post.create);
        this.router.post('/post/image', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(postSchema_1.postWithImageSchema), postCreate_1.post.createWithImage);
        this.router.post('/post/video', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(postSchema_1.postWithVideoSchema), postCreate_1.post.createWithVideo);
        this.router.get('/posts', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.posts);
        this.router.get('/posts/auth/:authId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.postsByAuthId);
        this.router.get('/posts/:authId/image', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.postsWithImageByAuthId);
        this.router.get('/posts/:authId/video', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.postsWithVideosByAuthId);
        this.router.get('/posts/:postId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.postsWithId);
        this.router.patch('/posts/:postId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(postSchema_1.postUpdationSchema), update_1.update.post);
        this.router.delete('/posts/:postId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, destroy_1.destory.post);
        return this.router;
    }
}
exports.postRoutes = new Router();
