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
exports.signup = exports.Signup = void 0;
// Remote imports
const cloudinary_1 = require("../../../shared/global/helpers/cloudinary");
const errorHandler_1 = require("../../../shared/global/helpers/errorHandler");
const authService_1 = require("../../../shared/services/db/authService");
const userCache_1 = require("../../../shared/services/redis/userCache");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const authWorker_1 = require("../../../shared/workers/authWorker");
const signupWorker_1 = require("../../../shared/workers/signupWorker");
const helpers_1 = require("../../../shared/global/helpers/helpers");
const config_1 = require("../../../config");
class Signup {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, email, password, avatarColor, avatarImage } = req.body;
            const user = yield authService_1.AuthService.getAuthByEmailOrUsername(userName, email);
            if (user)
                throw new errorHandler_1.BadRequestError('Use another email or username');
            const authId = helpers_1.Helpers.createObjectId();
            const userId = helpers_1.Helpers.createObjectId();
            const result = yield cloudinary_1.cloudinaryUploader.imageUpload(avatarImage, `${userId}`, true, true);
            if (!(result === null || result === void 0 ? void 0 : result.public_id))
                throw new errorHandler_1.BadRequestError('File upload: failed Try again.');
            const authObj = {
                _id: userId,
                userName,
                email,
                password,
                avatarColor,
                avatarImage,
                authId,
            };
            // saving to redis
            const userData = Object.assign(Object.assign({}, Signup.prototype.redisUserData(authObj)), { avatarImage: `${result.url}` });
            yield userCache_1.userCache.addUser(userData);
            // token generation and adding to session
            const token = authService_1.AuthService.signToken({ userName, email, _id: userId, avatarImage, authId });
            req.session = { token };
            // saving to db
            new authWorker_1.AuthWorker().saveToDb(Signup.prototype.authData(req, authId));
            new signupWorker_1.SignupWorker().saveToDb(Signup.prototype.userData(authId, userId, userName));
            res.status(http_status_codes_1.default.CREATED).json({ message: 'success', user: userData });
        });
    }
    redisUserData(authObj) {
        const { userName, email, avatarColor, avatarImage, _id } = authObj;
        return {
            _id,
            userName,
            email,
            avatarColor,
            avatarImage,
            name: userName,
            userSettings: {
                notificationSettings: {
                    onFollow: true,
                    onLike: true,
                    onMessage: true,
                    onComment: true,
                },
                postSettings: {
                    private: false,
                    public: true,
                    unlisted: false,
                },
                storySettings: {
                    visibleForFollowers: false,
                    visibleForUserOnly: true,
                },
            },
            basicInfo: { job: '', location: '', quote: '', school: '' },
            isBanned: false,
            isDeleted: false,
            isVerified: false,
            role: 'user',
            passwordResetToken: '',
            passwordResetExpires: '',
            socialMediaLinks: {
                facebook: '',
                instagram: '',
            },
            dob: '',
            profileImg: config_1.config.DEFAULT_PROFILE_IMG,
            followersCount: 0,
            followeeCount: 0,
            bgImageId: '',
            bgImageVersion: '',
            imgId: '',
            imgVersion: '',
            bgImg: '',
            blocked: [],
            blockedBy: [],
            totalPost: 0,
        };
    }
    authData(data, authId) {
        const { userName, email, password, avatarColor, avatarImage } = data.body;
        return { userName, email, password, avatarColor, avatarImage, _id: authId.toString() };
    }
    userData(authId, userId, name) {
        return {
            authId,
            _id: userId,
            name,
            profileImg: config_1.config.DEFAULT_PROFILE_IMG,
            totalPost: 0,
            basicInfo: { job: '', location: '', quote: '', school: '' },
        };
    }
}
exports.Signup = Signup;
exports.signup = new Signup();
