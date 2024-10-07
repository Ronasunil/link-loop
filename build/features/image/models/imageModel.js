"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const imageSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    imageId: {
        type: String,
        default: '',
    },
    imageVersion: {
        type: String,
        default: '',
    },
    bgImageVersion: {
        type: String,
        default: '',
    },
    bgImageId: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
exports.imageModel = mongoose_1.default.model('Image', imageSchema);
