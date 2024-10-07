"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.JoiValidationFailed = exports.NotAuthorizedError = exports.BadRequestError = exports.CustomError = void 0;
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
exports.BadRequestError = BadRequestError;
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
exports.NotAuthorizedError = NotAuthorizedError;
class JoiValidationFailed extends CustomError {
    constructor(details) {
        super(details.message);
        this.details = details;
        this.statusCode = http_status_codes_1.default.BAD_REQUEST;
        this.status = 'error';
    }
    serializeError() {
        return this.details.details.map((error) => ({
            message: error.message,
            status: this.status,
            statusCode: this.statusCode,
            path: String(error.path),
        }));
    }
}
exports.JoiValidationFailed = JoiValidationFailed;
class NotFoundError extends CustomError {
    constructor(msg) {
        super(msg);
        this.statusCode = 404;
        this.status = 'erorr';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeError() {
        return [{ message: this.message, status: this.status, statusCode: this.statusCode }];
    }
}
exports.NotFoundError = NotFoundError;
