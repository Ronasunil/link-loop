"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUpdationSchema = exports.postWithVideoSchema = exports.postWithImageSchema = exports.postSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.postSchema = joi_1.default.object({
    content: joi_1.default.string().required().allow(null, ''),
    bgColor: joi_1.default.string().required().allow(null, ''),
    feelings: joi_1.default.string().required().allow(null, ''),
    profilePic: joi_1.default.string().required().allow(null, ''),
    privacy: joi_1.default.string().required().valid('unlisted', 'public', 'private'),
    gifUrl: joi_1.default.string().required().allow(null, ''),
});
exports.postWithImageSchema = joi_1.default.object({
    image: joi_1.default.string().required(),
    bgColor: joi_1.default.string().required().allow(null, ''),
    feelings: joi_1.default.string().required().allow(null, ''),
    profilePic: joi_1.default.string().required().allow(null, ''),
    privacy: joi_1.default.string().required().valid('unlisted', 'public', 'private'),
    gifUrl: joi_1.default.string().required().allow(null, ''),
});
exports.postWithVideoSchema = joi_1.default.object({
    video: joi_1.default.string().required(),
    bgColor: joi_1.default.string().required().allow(null, ''),
    feelings: joi_1.default.string().required().allow(null, ''),
    profilePic: joi_1.default.string().required().allow(null, ''),
    privacy: joi_1.default.string().required().valid('unlisted', 'public', 'private'),
    gifUrl: joi_1.default.string().required().allow(null, ''),
});
exports.postUpdationSchema = joi_1.default.object({
    image: joi_1.default.string().optional().allow(null, ''),
    video: joi_1.default.string().optional().allow(null, ''),
    bgColor: joi_1.default.string().optional().allow(null, ''),
    feelings: joi_1.default.string().optional().allow(null, ''),
    profilePic: joi_1.default.string().optional().allow(null, ''),
    privacy: joi_1.default.string().optional().valid('unlisted', 'public', 'private'),
    gifUrl: joi_1.default.string().optional().allow(null, ''),
    content: joi_1.default.string().optional().allow(null, ''),
    imageId: joi_1.default.string().optional().allow(null, ''),
    imageVersion: joi_1.default.string().optional().allow(null, ''),
    reactions: joi_1.default.object({
        like: joi_1.default.number().required().default(0),
        wow: joi_1.default.number().required().default(0),
        sad: joi_1.default.number().required().default(0),
        angry: joi_1.default.number().required().default(0),
        laugh: joi_1.default.number().required().default(0),
    }).optional(),
});
