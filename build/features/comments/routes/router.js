"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const create_1 = require("../controllers/create");
const destroy_1 = require("../controllers/destroy");
const get_1 = require("../controllers/get");
const update_1 = require("../controllers/update");
const commentSchema_1 = require("../schemas/commentSchema");
const middlewares_1 = require("../../../shared/global/helpers/middlewares");
const express_1 = require("express");
class Router {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.patch('/posts/:postId/comments/:commentId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(commentSchema_1.commentUpdationSchema), update_1.update.comment);
        this.router.post('/posts/comment', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(commentSchema_1.commentSchema), create_1.comment.create);
        this.router.get('/posts/:postId/comment/:commentId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.comment);
        this.router.get('/posts/comment/:postId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.allCommentsOfPost);
        this.router.get('/posts/comment/username/:postId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.commentsUserName);
        this.router.delete('/posts/:postId/comments/:commentId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, destroy_1.destroy.comment);
        return this.router;
    }
}
exports.commentRouter = new Router();
