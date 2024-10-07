"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const followerSchema = new mongoose_1.default.Schema({
    followerId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User',
    },
    followeeId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
followerSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });
exports.followerModel = mongoose_1.default.model('Follower', followerSchema);
