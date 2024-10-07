"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRouter = void 0;
const middlewares_1 = require("../../../shared/global/helpers/middlewares");
const express_1 = require("express");
const imageSchema_1 = require("../schemas/imageSchema");
const create_1 = require("../controller/create");
const destroy_1 = require("../controller/destroy");
const get_1 = require("../controller/get");
class Router {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.get('/image/profile', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.proileImages);
        this.router.get('/image/background', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.bgImages);
        this.router.get('/image/:imageId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, get_1.get.image);
        this.router.post('/image/profileImage', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(imageSchema_1.imageSchema), create_1.create.profileImage);
        this.router.post('/image/bgImage', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(imageSchema_1.imageSchema), create_1.create.bgImage);
        this.router.delete('/image/profileImg/:imageId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, destroy_1.destroy.ProfileImg);
        this.router.delete('/image/background/:imageId', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, destroy_1.destroy.bgImg);
        return this.router;
    }
}
exports.imageRouter = new Router();
