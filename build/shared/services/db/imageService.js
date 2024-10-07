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
exports.ImageService = void 0;
const config_1 = require("../../../config");
const imageModel_1 = require("../../../features/image/models/imageModel");
const userModel_1 = require("../../../features/users/models/userModel");
class ImageService {
    static addProfileImage(userId, url, imageId, imageVersion, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = ImageService.prototype.addImageDb(userId, imageId, imageVersion, type);
            const user = yield userModel_1.userModel.findByIdAndUpdate(userId, { profileImg: url }, { new: true, runValidators: true });
            yield Promise.all([image, user]);
        });
    }
    static addBgImageDb(userId, url, imageId, imageVersion, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ImageService.prototype.addImageDb(userId, imageId, imageVersion, type);
            yield userModel_1.userModel.findByIdAndUpdate(userId, { bgImg: url });
        });
    }
    addImageDb(userId, imageId, imageVersion, type) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('kl happened');
            yield imageModel_1.imageModel.create({
                userId,
                imageId: type === 'profile' ? imageId : '',
                imageVersion: type === 'profile' ? imageVersion : '',
                bgImageId: type === 'bg' ? imageId : '',
                bgImageVersion: type === 'bg' ? imageVersion : '',
                createdAt: new Date(),
            });
        });
    }
    static deleteBgImageDb(imageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                imageModel_1.imageModel.findOneAndDelete({ _id: imageId, userId }),
                userModel_1.userModel.findByIdAndUpdate(userId, { bgImg: '' }),
            ]);
        });
    }
    static deleteProfileImageDb(imageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('delete');
            console.log(yield imageModel_1.imageModel.findOne({ _id: imageId, userId }), userId);
            yield Promise.all([
                imageModel_1.imageModel.findOneAndDelete({ _id: imageId, userId }),
                userModel_1.userModel.findByIdAndUpdate(userId, { profileImg: config_1.config.DEFAULT_PROFILE_IMG }),
            ]);
        });
    }
    static getImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageModel_1.imageModel.findById(imageId);
        });
    }
    static getImages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId);
            const images = yield imageModel_1.imageModel.find({ userId, imageId: { $ne: '' }, imageVersion: { $ne: '' } });
            return images;
        });
    }
    static getBgImages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId);
            const images = yield imageModel_1.imageModel.find({ userId, bgImageId: { $ne: '' }, bgImageVersion: { $ne: '' } });
            return images;
        });
    }
}
exports.ImageService = ImageService;
