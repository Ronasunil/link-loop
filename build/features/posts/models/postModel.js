"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        default: '',
    },
    totalReaction: {
        type: Number,
        default: 0,
    },
    profilePic: {
        type: String,
        default: '',
    },
    email: String,
    authId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Auth',
        index: true,
    },
    totalComments: {
        type: Number,
        default: 0,
    },
    reactions: {
        like: { type: Number, default: 0 },
        sad: { type: Number, default: 0 },
        laugh: { type: Number, default: 0 },
        wow: { type: Number, default: 0 },
        angry: { type: Number, default: 0 },
    },
    gifUrl: {
        type: String,
        default: '',
    },
    privacy: {
        type: String,
        enum: ['public', 'private', 'unlisted'],
        default: 'public',
    },
    imageId: { type: String, default: '' },
    imageVersion: { type: String, default: '' },
    videoId: { type: String, default: '' },
    videoVersion: { type: String, default: '' },
    feelings: { type: String, default: '' },
    bgColor: {
        type: String,
        default: 'white',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.postModel = mongoose_1.default.model('Post', postSchema);
