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
exports.post = void 0;
const helpers_1 = require("../../../shared/global/helpers/helpers");
const postCache_1 = require("../../../shared/services/redis/postCache");
const postSocket_1 = require("../../../features/sockets/postSocket");
const postWorker_1 = require("../../../shared/workers/postWorker");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_1 = require("../../../shared/global/helpers/cloudinary");
const errorHandler_1 = require("../../../shared/global/helpers/errorHandler");
class Post {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postData = Post.prototype.getPostData(req.body, req);
            console.log(req.currentUser);
            postSocket_1.postSocketIo.emit('add-post', postData);
            yield postCache_1.postCache.addPost(postData);
            const postWorker = yield new postWorker_1.PostWorker().prepareQueueForCreation(postData);
            postWorker.addPost();
            res.status(http_status_codes_1.default.OK).json({ message: 'Post created', post: postData });
        });
    }
    createWithImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { image } = req.body;
            // uploading file to cloudinary
            const result = yield cloudinary_1.cloudinaryUploader.imageUpload(image);
            if (!(result === null || result === void 0 ? void 0 : result.public_id))
                throw new errorHandler_1.BadRequestError('File upload failed: Try again');
            // getting formatted data for saving to redis
            const postData = Post.prototype.getPostWithImgData(req.body, req, {
                imageId: result === null || result === void 0 ? void 0 : result.public_id,
                imageVersion: result === null || result === void 0 ? void 0 : result.version.toString(),
            });
            postSocket_1.postSocketIo.emit('add-post', postData);
            yield postCache_1.postCache.addPost(postData);
            const postWorker = yield new postWorker_1.PostWorker().prepareQueueForCreation(postData);
            postWorker.addPost();
            res.status(http_status_codes_1.default.OK).json({ message: 'Post created', post: postData });
        });
    }
    createWithVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postData = yield Post.prototype.getPostVideoData(req);
            postSocket_1.postSocketIo.emit('add-post', postData);
            yield postCache_1.postCache.addPost(postData);
            const postWorker = yield new postWorker_1.PostWorker().prepareQueueForCreation(postData);
            postWorker.addPost();
            res.status(http_status_codes_1.default.OK).json({ message: 'Post created', post: postData });
        });
    }
    getPostWithImgData(data, req, others) {
        var _a, _b;
        const { content, bgColor, feelings, privacy, gifUrl, profilePic, image } = data;
        const { imageId, imageVersion } = others;
        const _id = helpers_1.Helpers.createObjectId();
        return {
            content,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            profilePic,
            image,
            imageId,
            videoId: '',
            videoVersion: '',
            imageVersion,
            _id,
            // @ts-ignore
            authId: (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.authId,
            createdAt: new Date(),
            // @ts-ignore
            email: (_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.email,
            reactions: {
                like: 0,
                sad: 0,
                laugh: 0,
                wow: 0,
                angry: 0,
            },
            totalComments: 0,
            totalReaction: 0,
        };
    }
    getPostData(data, req) {
        var _a, _b;
        const { content, bgColor, feelings, privacy, gifUrl, profilePic } = data;
        const _id = helpers_1.Helpers.createObjectId();
        return {
            content,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            profilePic,
            _id,
            // @ts-ignore
            authId: (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.authId,
            createdAt: new Date(),
            // @ts-ignore
            email: (_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.email,
            imageId: '',
            imageVersion: '',
            videoId: '',
            videoVersion: '',
            reactions: {
                like: 0,
                sad: 0,
                laugh: 0,
                wow: 0,
                angry: 0,
            },
            totalComments: 0,
            totalReaction: 0,
        };
    }
    getPostVideoData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { video, bgColor, feelings, privacy, gifUrl, profilePic } = req.body;
            const _id = helpers_1.Helpers.createObjectId();
            const result = yield cloudinary_1.cloudinaryUploader.videoUpload(video);
            if (!(result === null || result === void 0 ? void 0 : result.public_id))
                throw new errorHandler_1.BadRequestError('Video upload: failed');
            return {
                content: '',
                videoId: result.public_id,
                videoVersion: result.version.toString(),
                bgColor,
                feelings,
                privacy,
                gifUrl,
                profilePic,
                _id,
                // @ts-ignore
                authId: req.currentUser.authId,
                createdAt: new Date(),
                // @ts-ignore
                email: req.currentUser.email,
                imageId: '',
                imageVersion: '',
                reactions: {
                    like: 0,
                    sad: 0,
                    laugh: 0,
                    wow: 0,
                    angry: 0,
                },
                totalComments: 0,
                totalReaction: 0,
            };
        });
    }
}
exports.post = new Post();
