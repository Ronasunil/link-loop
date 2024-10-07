"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const middlewares_1 = require("../../../shared/global/helpers/middlewares");
const express_1 = require("express");
const authSchema_1 = require("../schemas/authSchema");
const signup_1 = require("../controllers/signup");
const login_1 = require("../controllers/login");
const currentUser_1 = require("../controllers/currentUser");
const signOut_1 = require("../controllers/signOut");
const password_1 = require("../controllers/password");
const forgotPasswordSchema_1 = require("../schemas/forgotPasswordSchema");
const resetPasswordSchema_1 = require("../schemas/resetPasswordSchema");
const updationSchema_1 = require("../schemas/updationSchema");
class Routes {
    constructor() {
        this.Router = (0, express_1.Router)();
    }
    routes() {
        this.Router.post('/signup', middlewares_1.Middlewares.joiValidation(authSchema_1.authSchema), signup_1.signup.createUser);
        this.Router.post('/login', login_1.login.authenticate);
        this.Router.get('/currentUser', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, currentUser_1.curentUser.get);
        this.Router.delete('/signout', signOut_1.signout.delete);
        this.Router.post('/forgotPassword', 
        // Middlewares.validateToken,
        // Middlewares.currentUserCheck,
        middlewares_1.Middlewares.joiValidation(forgotPasswordSchema_1.forgotPasswordSchema), password_1.password.forgotPassword);
        this.Router.post('/resetPassword/:resetToken', 
        // Middlewares.validateToken,
        // Middlewares.currentUserCheck,
        middlewares_1.Middlewares.joiValidation(resetPasswordSchema_1.resetPasswordSchema), password_1.password.resetPassword);
        this.Router.patch('/auth/password', middlewares_1.Middlewares.validateToken, middlewares_1.Middlewares.currentUserCheck, middlewares_1.Middlewares.joiValidation(updationSchema_1.passwordUpdationSchema), password_1.password.changePassword);
        return this.Router;
    }
}
exports.authRoutes = new Routes();
