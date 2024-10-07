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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notificationModel_1 = require("../../../features/notification/model/notificationModel");
class NotificationService {
    static createNotificationDB(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield notificationModel_1.notificationModel.create(data);
        });
    }
    static getNotificationsDB(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notificationModel_1.notificationModel
                .find({ userTo: userId })
                .populate({ path: 'userTo', select: 'name, email, profileImg' });
            return notifications;
        });
    }
    static updateNotification(notficationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield notificationModel_1.notificationModel.findByIdAndUpdate(notficationId, { read: true });
        });
    }
}
exports.NotificationService = NotificationService;
