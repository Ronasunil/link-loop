"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.resetPasswordSchema = joi_1.default.object({
    password: joi_1.default.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
        'string.base': 'Password should be string',
        'string.empty': 'Please enter the password',
        'string.pattern.base': 'Password must be 8-32 characters with at least one uppercase, lowercase, and special character',
    }),
    confirmPassword: joi_1.default.string().required().valid(joi_1.default.ref('password')).messages({
        'string.base': 'confirm-password should be string',
        'string.empty': 'Please enter the confirm-password',
        'any.only': 'Confirm-password must be same as password',
    }),
});
