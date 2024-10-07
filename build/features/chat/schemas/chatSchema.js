"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userChatSchema = exports.chatDeletionSchema = exports.chatReactionSchema = exports.chatSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.chatSchema = joi_1.default.object({
    conversationId: joi_1.default.string().optional().default('').allow(''),
    reciverId: joi_1.default.string().required().messages({ 'any.required': 'reciverId is required' }),
    reciverProfileImg: joi_1.default.string().required().allow('').messages({ 'any.required': 'reciverProfileImg is required' }),
    reciverName: joi_1.default.string().required().messages({ 'any.required': 'reciverName is required' }),
    message: joi_1.default.string().optional().default('').allow(''),
    image: joi_1.default.string().optional().default('').allow(''),
    gif: joi_1.default.string().optional().default('').allow(''),
});
exports.chatReactionSchema = joi_1.default.object({
    type: joi_1.default.string().required().valid('like', 'love', 'sad', 'laugh', 'angry').messages({
        'any.required': 'The type field is required.',
        'string.base': 'The type must be a string.',
        'any.only': 'The type must be one of the following: like, love, sad, laugh, angry.',
    }),
});
exports.chatDeletionSchema = joi_1.default.object({
    type: joi_1.default.string().required().allow('deleteForMe', 'deleteForEveryone'),
});
exports.userChatSchema = joi_1.default.object({
    userOne: joi_1.default.string().required().messages({ 'any.required': 'userOne is required' }),
    userTwo: joi_1.default.string().required().messages({ 'any.required': 'userTwo is required' }),
});
