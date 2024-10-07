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
exports.update = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const userCache_1 = require("../../../shared/services/redis/userCache");
const userWorker_1 = require("../../../shared/workers/userWorker");
class Update {
    socialLinks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { facebook, instagram } = req.body;
            const userId = req.currentUser._id.toString();
            const updatedUser = yield userCache_1.userCache.updateSocialLinks(userId, { facebook, instagram });
            const userWorker = yield new userWorker_1.UserWorker().prepareQueueForSocialUpdation({ userId, data: { facebook, instagram } });
            userWorker.updateUserSocialLink();
            res.status(http_status_codes_1.default.OK).json({ message: 'Social link updated', data: updatedUser });
        });
    }
    basicInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.currentUser._id.toString();
            const user = yield userCache_1.userCache.updateBasicInfo(userId, Object.assign({}, req.body));
            const userWorker = yield new userWorker_1.UserWorker().prepareQueueForBasicInfoUpdation({ userId, data: req.body });
            userWorker.updateBasicInfo();
            res.status(http_status_codes_1.default.OK).json({ message: 'Basic info updated', user });
        });
    }
    notification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.currentUser._id.toString();
            console.log(req.body.onComment);
            const user = yield userCache_1.userCache.updateNotification(userId, req.body);
            const userWorker = yield new userWorker_1.UserWorker().prepareQueueForNotificationUpdation({ userId, data: req.body });
            userWorker.updateNotification();
            res.status(http_status_codes_1.default.OK).json({ message: 'Notification updated', user });
        });
    }
}
exports.update = new Update();
