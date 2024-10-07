"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentUpdationSchema = exports.commentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.commentSchema = joi_1.default.object({
    userTo: joi_1.default.string().required().messages({
        'any.required': 'userTo is rquired',
    }),
    profilePic: joi_1.default.string().required().default('').allow(null, '').messages({
        'any.required': 'profilePic is required',
    }),
    postId: joi_1.default.string().required().messages({
        'any.required': 'postId is required',
    }),
    comment: joi_1.default.string().required().messages({
        'any.required': 'This field is required',
    }),
});
exports.commentUpdationSchema = joi_1.default.object({
    comment: joi_1.default.string().required().messages({
        'any.required': 'This field is required',
    }),
});
