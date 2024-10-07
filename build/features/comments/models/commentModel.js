"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    userTo: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        required: true,
    },
    authId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Auth',
        required: true,
        index: true,
    },
    postId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true,
    },
    comment: {
        type: String,
        required: true,
        default: '',
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
exports.commentModel = mongoose_1.default.model('Comment', commentSchema);
