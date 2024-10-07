"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReactionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addReactionSchema = joi_1.default.object({
    profilePic: joi_1.default.string().allow(null, ''),
    userName: joi_1.default.string().required().messages({
        'any.required': 'User name is missing',
    }),
    postId: joi_1.default.string().required().messages({
        'any.required': 'postId is missing',
    }),
    userTo: joi_1.default.string().required().messages({
        'any.required': 'userTo is missing',
    }),
    reactionType: joi_1.default.string().required().valid('like', 'sad', 'laugh', 'wow', 'angry'),
});
