"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationService_1 = require("../../../shared/services/db/notificationService");
const notificationSchema = new mongoose_1.default.Schema({
    userTo: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userFrom: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: '',
        required: true,
    },
    entityId: mongoose_1.default.Types.ObjectId,
    createdItemId: mongoose_1.default.Types.ObjectId,
    notificationType: { type: String, required: true },
    comment: { type: String, default: '' },
    reaction: { type: String, default: '' },
    post: { type: String, default: '' },
    imgId: { type: String, default: '' },
    imgVersion: { type: String, default: '' },
    createdAt: { type: Date, default: new Date() },
});
notificationSchema.methods.insertNotification = function (data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userTo } = data;
        yield notificationService_1.NotificationService.createNotificationDB(data);
        return userTo.toString();
    });
};
exports.notificationModel = mongoose_1.default.model('Notification', notificationSchema);
