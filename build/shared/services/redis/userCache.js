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
exports.userCache = exports.UserCache = void 0;
const baseCache_1 = require("./baseCache");
const errorHandler_1 = require("../../global/helpers/errorHandler");
const postCache_1 = require("./postCache");
const followerCache_1 = require("./followerCache");
const helpers_1 = require("../../global/helpers/helpers");
class UserCache extends baseCache_1.BaseCache {
    constructor() {
        super();
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: userId } = user;
            const dataString = JSON.stringify(user);
            yield this.client.set(`user:${userId}`, dataString);
            yield this.client.sadd(`userIds`, `user:${userId}`);
        });
    }
    getUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.client.get(`user:${identifier}`);
            if (!user)
                throw new errorHandler_1.BadRequestError(`Can't find user`);
            return JSON.parse(user);
        });
    }
    getUserProfileAndPost(userId, authId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userId);
            const posts = yield postCache_1.postCache.getPostsByAuthId(authId, skip, limit);
            return { user, posts };
        });
    }
    getRandomUserSuggestion(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, skip = 0, limit = 10) {
            const users = yield this.getAllusers(userId, skip, limit);
            const followings = yield followerCache_1.followerCache.getFollowees(userId);
            const excludedUsers = users.filter((user) => {
                if (!followings.includes(user._id.toString()))
                    return user;
            });
            return helpers_1.Helpers.suffleArray(excludedUsers);
        });
    }
    getAllusers(excludeId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = [];
            const userIds = (yield this.client.smembers('userIds')).slice(skip, limit);
            // console.log(userIds, userIds.length, limit);
            for (const id of userIds) {
                if (id === `user:${excludeId}`)
                    continue;
                const user = yield this.getUser(id);
                users.push(user);
            }
            console.log(users);
            return users;
        });
    }
    getTotalUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.client.smembers('userIds');
            return users.length;
        });
    }
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userId);
            const updatedData = JSON.stringify(Object.assign(Object.assign({}, user), data));
            this.client.set(`user:${userId}`, updatedData);
            return JSON.parse(updatedData);
        });
    }
    updateBasicInfo(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userId);
            user.basicInfo = Object.assign(Object.assign({}, user.basicInfo), data);
            yield this.client.set(`user:${userId}`, JSON.stringify(user));
            return user;
        });
    }
    updateNotification(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userId);
            const notificationSettings = user.userSettings.notificationSettings;
            user.userSettings.notificationSettings = Object.assign(Object.assign({}, notificationSettings), data);
            this.client.set(`users:${userId}`, JSON.stringify(user));
            return user;
        });
    }
    updateSocialLinks(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userId);
            console.log(Object.assign(Object.assign({}, data), user.socialMediaLinks), data, user.socialMediaLinks);
            if (data === null || data === void 0 ? void 0 : data.facebook)
                user.socialMediaLinks.facebook = data.facebook;
            if (data === null || data === void 0 ? void 0 : data.instagram)
                user.socialMediaLinks.instagram = data.instagram;
            yield this.client.set(`user:${userId}`, JSON.stringify(user));
            return user;
        });
    }
    incrFollowCount(userId, key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userId);
            const updatedCount = user[key] + value;
            const updatedData = JSON.stringify(Object.assign(Object.assign({}, user), { [key]: updatedCount }));
            this.client.set(`user:${userId}`, updatedData);
        });
    }
}
exports.UserCache = UserCache;
exports.userCache = new UserCache();
