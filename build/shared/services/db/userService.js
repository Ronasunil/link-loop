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
exports.UserService = void 0;
const errorHandler_1 = require("../../global/helpers/errorHandler");
const userModel_1 = require("../../../features/users/models/userModel");
const postService_1 = require("./postService");
const followerService_1 = require("./followerService");
const helpers_1 = require("../../global/helpers/helpers");
const authModel_1 = require("../../../features/auth/models/authModel");
class UserService {
    static getAllUsers(excludeId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userModel_1.userModel
                .find({ _id: { $ne: excludeId } })
                .skip(skip)
                .limit(limit);
            return users;
        });
    }
    static getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.userModel.findById(userId);
            if (!user)
                throw new errorHandler_1.NotFoundError(`Can't find user with this id:${userId}`);
            return user;
        });
    }
    static getUserProfileAndPost(userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userId);
            const posts = yield postService_1.PostService.getPostbyAuthIdDb(user.authId.toString(), skip, limit);
            return { user, posts };
        });
    }
    static getRandomUserSuggestionDb(userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield UserService.getAllUsers(userId, skip, limit);
            console.log(users.length);
            const followings = yield followerService_1.FollowerService.getFollowingsIds(userId);
            const excludedUsers = users.filter((user) => {
                if (!followings.includes(user._id.toString()))
                    return user;
            });
            return helpers_1.Helpers.suffleArray(excludedUsers);
        });
    }
    static updateSocialLink(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.userModel.findById(userId);
            if (!user)
                throw new errorHandler_1.NotFoundError(`User regarding this id:${userId} not found`);
            const socialLinks = Object.assign(Object.assign({}, user.socialMediaLinks), data);
            yield userModel_1.userModel.findByIdAndUpdate(userId, { socialMediaLinks: socialLinks });
        });
    }
    static updateBasicinfo(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.userModel.findById(userId);
            if (!user)
                throw new errorHandler_1.NotFoundError(`User regarding this id:${userId} not found`);
            const basicInfo = Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user.basicInfo), data);
            yield userModel_1.userModel.findByIdAndUpdate(userId, { basicInfo });
        });
    }
    static updateNotification(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield userModel_1.userModel.findById(userId);
            if (!user)
                throw new errorHandler_1.NotFoundError(`User regarding this id:${userId} not found`);
            const notification = Object.assign(Object.assign({}, (_a = user.userSettings) === null || _a === void 0 ? void 0 : _a.notificationSettings), data);
            yield userModel_1.userModel.findByIdAndUpdate(userId, { $set: { 'userSetting.notificationSettings': notification } });
        });
    }
    static searchUsers(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUsers = yield authModel_1.authModel.aggregate([
                { $match: { userName: { $regex: `^${userName}[^a-zA-Z0-9]*`, $options: 'i' } } },
                { $lookup: { from: 'users', localField: '_id', foreignField: 'authId', as: 'user' } },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        userName: 1,
                        profileImg: '$user.profileImg',
                        email: 1,
                    },
                },
            ]);
            return authUsers;
        });
    }
    static getTotalUsersCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUsersCount = yield userModel_1.userModel.find({}).countDocuments();
            return totalUsersCount;
        });
    }
}
exports.UserService = UserService;
