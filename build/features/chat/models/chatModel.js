"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    conversationId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Conversation',
        index: true,
    },
    senderId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    senderProfileImg: {
        type: String,
        required: true,
    },
    reciverId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reciverName: {
        type: String,
        required: true,
    },
    reciverProfileImg: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    gif: {
        type: String,
        default: '',
    },
    reaction: Array,
    deleteForMe: {
        type: Boolean,
        default: false,
    },
    deleteForEveryone: {
        type: Boolean,
        default: false,
    },
    isRead: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
exports.chatModel = mongoose_1.default.model('Chat', chatSchema);
