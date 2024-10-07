"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
// remote imports
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
// local imports
const config_1 = require("./config");
const errorHandler_1 = require("./shared/global/helpers/errorHandler");
const routes_1 = require("./routes");
class App {
    constructor(app) {
        this.app = app;
        this.start();
    }
    get application() {
        return this.app;
    }
    start() {
        this.standardMiddlewares(this.app);
        this.securityMiddlewares(this.app);
        this.globalMiddlewares(this.app);
        this.routeMiddlewares(this.app);
        this.errorHandler(this.app);
    }
    standardMiddlewares(app) {
        app.use((0, express_1.json)({ limit: '10mb' }));
        app.use((0, express_1.urlencoded)({ extended: false, limit: '10mb' }));
        app.use((0, compression_1.default)());
        // prettier-ignore
        app.use((0, cookie_session_1.default)({ name: "session", keys: [config_1.config.SESSION_SECRET], maxAge: 24 * 30 * 3600000, secure: false }));
    }
    securityMiddlewares(app) {
        app.use((0, helmet_1.default)());
        app.use((0, hpp_1.default)());
        // prettier-ignore
        app.use((0, cors_1.default)({ origin: "*", credentials: true, methods: ["GET", "PATCH", "POST", "OPTIONS", "DELETE"] }));
    }
    globalMiddlewares(app) { }
    routeMiddlewares(app) {
        (0, routes_1.routes)(app);
    }
    errorHandler(app) {
        app.all('*', (req, res) => {
            res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
        });
        app.use((error, req, res, next) => {
            if (error instanceof errorHandler_1.CustomError)
                return res.status(error.statusCode).json(error.serializeError());
            console.log(error);
            res.status(520).json([{ message: 'Unknown error', status: 'error', statusCode: 520 }]);
        });
    }
}
exports.App = App;
