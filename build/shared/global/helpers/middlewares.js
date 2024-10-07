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
exports.Middlewares = void 0;
const errorHandler_1 = require("./errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
class Middlewares {
    static joiValidation(schema) {
        return function (req, res, next) {
            const { error } = schema.validate(req.body);
            if (!error)
                return next();
            throw new errorHandler_1.JoiValidationFailed(error);
        };
    }
    static validateToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.token))
                throw new errorHandler_1.NotAuthorizedError('Token not exist');
            try {
                const payload = jsonwebtoken_1.default.verify(req.session.token, config_1.config.JWT_SECRET);
                req.currentUser = payload;
                next();
            }
            catch (err) {
                throw new errorHandler_1.NotAuthorizedError('Token not exist');
            }
        });
    }
    static currentUserCheck(req, res, next) {
        if (!req.currentUser)
            throw new Error('Unauthorized access');
        console.log(req.currentUser.authId);
        next();
    }
}
exports.Middlewares = Middlewares;
