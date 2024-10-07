"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reactionSchema = new mongoose_1.default.Schema({
    profilePic: {
        type: String,
        default: '',
    },
    userName: {
        type: String,
        required: true,
        default: '',
    },
    postId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Post',
        index: true,
    },
    userFrom: {
        type: String,
        required: true,
    },
    userTo: {
        type: String,
        required: true,
    },
    authId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Auth',
    },
    reactionType: {
        type: String,
        enum: ['like', 'sad', 'laugh', 'wow', 'angry'],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
}, {
    toJSON: {
        transform: function (_doc, ret) {
            delete ret.__v;
        },
    },
});
exports.reactionModel = mongoose_1.default.model('Reaction', reactionSchema);
