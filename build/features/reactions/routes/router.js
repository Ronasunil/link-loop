"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionRouter = void 0;
const middlewares_1 = require("../../../shared/global/helpers/middlewares");
const create_1 = require("../controllers/create");
const get_1 = require("../controllers/get");
const reactionSchema_1 = require("../schemas/reactionSchema");
const express_1 = require("express");
class Router {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.get('/post/reactions/:postId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.reaction);
        this.router.post('/posts/reaction', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(reactionSchema_1.addReactionSchema), create_1.reaction.create);
        return this.router;
    }
}
exports.reactionRouter = new Router();
