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
exports.destroy = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const userCache_1 = require("../../../shared/services/redis/userCache");
const config_1 = require("../../../config");
const imageSocket_1 = require("../../../features/sockets/imageSocket");
const imageWorker_1 = require("../../../shared/workers/imageWorker");
class Destroy {
    ProfileImg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = req.currentUser._id.toString();
            console.log((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a._id, 'authid');
            const { imageId } = req.params;
            const updateduser = yield userCache_1.userCache.updateUser(userId, {
                profileImg: config_1.config.DEFAULT_PROFILE_IMG,
                imgId: '',
                imgVersion: '',
            });
            imageSocket_1.imageSocket.emit('updated user', updateduser);
            const imageWorker = yield new imageWorker_1.ImageWorker().prepareQueueForProfileDeletion({ imageId, userId });
            imageWorker.deleteProfileImg();
            res.status(http_status_codes_1.default.NO_CONTENT).json({ message: 'Deleted profile image' });
        });
    }
    bgImg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.currentUser._id.toString();
            const { imageId } = req.params;
            const updateduser = yield userCache_1.userCache.updateUser(userId, { bgImg: '', bgImageId: '', bgImageVersion: '' });
            imageSocket_1.imageSocket.emit('updated user', updateduser);
            const imageWorker = yield new imageWorker_1.ImageWorker().prepareQueueForBgDeletion({ imageId, userId });
            imageWorker.delteBgImg();
            res.status(http_status_codes_1.default.NO_CONTENT).json({ message: 'Deleted background image' });
        });
    }
}
exports.destroy = new Destroy();
