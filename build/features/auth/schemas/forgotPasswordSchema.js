"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().required().email().messages({
        'string.base': 'Email must be string',
        'string.empty': 'Please enter the email',
        'string.email': 'Invalid email address',
    }),
});
