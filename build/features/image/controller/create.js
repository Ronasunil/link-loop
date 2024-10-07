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
exports.create = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_1 = require("../../../shared/global/helpers/cloudinary");
const errorHandler_1 = require("../../../shared/global/helpers/errorHandler");
const userCache_1 = require("../../../shared/services/redis/userCache");
const config_1 = require("../../../config");
const imageWorker_1 = require("../../../shared/workers/imageWorker");
const imageSocket_1 = require("../../../features/sockets/imageSocket");
class Create {
    profileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.currentUser._id.toString();
            const { image } = req.body;
            const result = yield cloudinary_1.cloudinaryUploader.imageUpload(image, userId.toString(), true, true);
            if (!(result === null || result === void 0 ? void 0 : result.public_id))
                throw new errorHandler_1.BadRequestError('File upload failed: Try again');
            const profileImgUrl = `${config_1.config.CLOUDINARY_BASE_URL}v${result.version}/${result.public_id}`;
            const updatedUser = yield userCache_1.userCache.updateUser(userId, {
                profileImg: profileImgUrl,
                imgId: result.public_id.toString(),
                imgVersion: result.version.toString(),
            });
            imageSocket_1.imageSocket.emit('update user', updatedUser);
            const imageWorker = yield new imageWorker_1.ImageWorker().prepareQueueForProfile(Create.prototype.workerData(userId, profileImgUrl, 'profile', result));
            imageWorker.addProfileImg();
            res.status(http_status_codes_1.default.OK).json({ message: 'Profile picture added', user: updatedUser });
        });
    }
    bgImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.currentUser._id.toString();
            const { image } = req.body;
            const result = yield cloudinary_1.cloudinaryUploader.imageUpload(image, userId, true, true);
            if (!(result === null || result === void 0 ? void 0 : result.public_id))
                throw new errorHandler_1.BadRequestError('File upload failed: Try again');
            const bgImgUrl = `${config_1.config.CLOUDINARY_BASE_URL}v${result.version}/${result.public_id}`;
            const updatedUser = yield userCache_1.userCache.updateUser(userId, {
                bgImg: bgImgUrl,
                bgImageId: result.public_id.toString(),
                imgVersion: result.version.toString(),
            });
            console.log(updatedUser);
            imageSocket_1.imageSocket.emit('update user', updatedUser);
            const imageWorker = yield new imageWorker_1.ImageWorker().prepareQueueForBg(Create.prototype.workerData(userId, bgImgUrl, 'bg', result));
            imageWorker.addBgImg();
            res.status(http_status_codes_1.default.OK).json({ message: 'Background image added', user: updatedUser });
        });
    }
    workerData(userId, url, type, result) {
        const imageId = result.public_id.toString();
        const imageVersion = result.version.toString().replace(/v/g, '');
        return {
            userId,
            imageId,
            imageVersion,
            type,
            url,
        };
    }
}
exports.create = new Create();
