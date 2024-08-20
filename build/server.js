"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
// remote imports
const express_1 = require("express");
const http_1 = __importDefault(require("http"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const socket_io_1 = require("socket.io");
// local imports
const config_1 = require("./config");
const errorHandler_1 = require("./shared/global/helpers/errorHandler");
class Server {
    constructor(app) {
        this.app = app;
        this.PORT = config_1.config.PORT;
    }
    start() {
        this.standardMiddlewares(this.app);
        this.securityMiddlewares(this.app);
        this.globalMiddlewares(this.app);
        this.routeMiddlewares(this.app);
        this.errorHandler(this.app);
        this.startServer(this.app);
    }
    standardMiddlewares(app) {
        app.use((0, express_1.json)({ limit: '3mb' }));
        app.use((0, express_1.urlencoded)({ extended: false, limit: '3mb' }));
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
    routeMiddlewares(app) { }
    errorHandler(app) {
        app.all('*', (req, res) => {
            res
                .status(http_status_codes_1.default.NOT_FOUND)
                .json({ message: `${req.originalUrl} not found` });
        });
        app.use((error, req, res, next) => {
            if (error instanceof errorHandler_1.CustomError)
                return res.status(error.statusCode).json(error.serializeError());
            res
                .status(520)
                .json([{ message: 'Unknown error', status: 'error', statusCode: 520 }]);
        });
    }
    httpServer(httpServer) {
        httpServer.listen(this.PORT, () => {
            console.log(`Server start listening on port ${this.PORT}`);
        });
    }
    createSocketConnection(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            const io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: '*',
                    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
                },
            });
            const pubClient = (0, redis_1.createClient)({ url: config_1.config.REDIS_CLIENT });
            const subClient = pubClient.duplicate();
            yield Promise.all([pubClient.connect(), subClient.connect()]);
            console.log('connected to redis');
            io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            return io;
        });
    }
    startServer(app) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const httpServer = new http_1.default.Server(app);
                this.httpServer(httpServer);
                this.createSocketConnection(httpServer);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
exports.Server = Server;
