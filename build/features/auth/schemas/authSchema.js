"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.authSchema = joi_1.default.object({
    userName: joi_1.default.string().required().min(4).max(20).messages({
        'string.base': 'Username must only include characters',
        'string.empty': 'Please fill this field',
        'string.min': 'Username must need 4 character',
        'string.max': 'Total character for username is 20',
    }),
    email: joi_1.default.string().required().email().messages({
        'string.base': 'Email must be string',
        'string.empty': 'Please fill this field',
        'string.email': 'Invalid email address',
    }),
    password: joi_1.default.string()
        .min(8)
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
        'string.base': 'Password must be string',
        'string.empty': 'Please fill this field',
        'string.pattern.base': 'Password must be 8-32 characters with at least one uppercase, lowercase, and special character',
    }),
    confirmPassword: joi_1.default.string().required().valid(joi_1.default.ref('password')).messages({
        'string.base': 'Confirm-password must be string',
        'any.only': 'Confirm-password  and password must be same',
    }),
    avatarColor: joi_1.default.string(),
    avatarImage: joi_1.default.string(),
});
