"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class CustomError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.CustomError = CustomError;
class BadRequestError extends CustomError {
    constructor(msg) {
        super(msg);
        this.statusCode = http_status_codes_1.default.BAD_REQUEST;
        this.status = 'error';
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeError() {
        return [
            {
                message: this.message,
                status: this.status,
                statusCode: this.statusCode,
            },
        ];
    }
}
class NotAuthorizedError extends CustomError {
    constructor(msg) {
        super(msg);
        this.statusCode = http_status_codes_1.default.UNAUTHORIZED;
        this.status = 'error';
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeError() {
        return [
            {
                message: this.message,
                status: this.status,
                statusCode: this.statusCode,
            },
        ];
    }
}
