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
const postCache_1 = require("../../../shared/services/redis/postCache");
const postWorker_1 = require("../../../shared/workers/postWorker");
const postSocket_1 = require("../../../features/sockets/postSocket");
const cloudinary_1 = require("../../../shared/global/helpers/cloudinary");
const errorHandler_1 = require("../../../shared/global/helpers/errorHandler");
class Update {
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const updatedData = yield Update.prototype.getUpdatedData(req);
            const updatedPost = yield postCache_1.postCache.updatePost(postId, updatedData);
            postSocket_1.postSocketIo.emit('post-updated', updatedPost);
            const postworker = yield new postWorker_1.PostWorker().prepareQueueForUpdation(updatedData);
            postworker.updatePost(postId);
            res.status(http_status_codes_1.default.OK).json({ post: updatedPost });
        });
    }
    getUpdatedData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { imageId, imageVersion, image, video, videoVersion, videoId } = req.body;
            let data;
            data = req.body;
            if ((image && video) || (imageId && imageVersion && videoId && videoVersion)) {
                throw new errorHandler_1.BadRequestError('Image and video cannot be in the same post or something went wrong');
            }
            if (image && !video) {
                const result = yield cloudinary_1.cloudinaryUploader.imageUpload(image);
                if (!(result === null || result === void 0 ? void 0 : result.public_id))
                    throw new errorHandler_1.BadRequestError('File upload failed: Try again');
                data = Object.assign(Object.assign({}, req.body), { imageId: result.public_id, imageVersion: result.version.toString(), videoId: '', videoVersion: '' });
            }
            // post updation which includes updation of video NOTE:(updating video should not have image)
            if (video && !image) {
                const result = yield cloudinary_1.cloudinaryUploader.videoUpload(video);
                if (!(result === null || result === void 0 ? void 0 : result.public_id))
                    throw new errorHandler_1.BadRequestError('Video upload failed: Try again');
                data = Object.assign(Object.assign({}, req.body), { videoId: result.public_id, videoVersion: result.version.toString(), imageId: '', imageVersion: '' });
            }
            delete data.video;
            delete data.image;
            console.log(data, 'l');
            return data;
        });
    }
}
exports.update = new Update();
