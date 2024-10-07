"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
    receiverId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
});
exports.conversationModel = mongoose_1.default.model('Converstion', conversationSchema);
