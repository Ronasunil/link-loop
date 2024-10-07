"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordUpdationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.passwordUpdationSchema = joi_1.default.object({
    currentPassword: joi_1.default.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
        'string.base': 'Password must be string',
        'string.empty': 'currentPassword is required',
        'string.base.pattern': 'Password must be 8-32 characters with at least one uppercase, lowercase, and special character',
    }),
    newPassword: joi_1.default.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
        'string.base': 'Password must be string',
        'string.empty': 'newPassword is required',
        'string.base.pattern': 'Password must be 8-32 characters with at least one uppercase, lowercase, and special character',
    }),
    confirmPassword: joi_1.default.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .valid(joi_1.default.ref('newPassword'))
        .messages({
        'string.base': 'Confirm-password must be string',
        'any.only': 'Confirm-password  and password must be same',
    }),
});
