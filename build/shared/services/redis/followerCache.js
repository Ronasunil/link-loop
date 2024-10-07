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
exports.followerCache = void 0;
const baseCache_1 = require("./baseCache");
const userCache_1 = require("./userCache");
const errorHandler_1 = require("../../global/helpers/errorHandler");
class FollowerCache extends baseCache_1.BaseCache {
    constructor() {
        super();
    }
    addFollowee(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { followerId, userId } = data;
            const isFollower = yield this.client.hexists(`followersHash:${followerId}`, userId);
            if (isFollower)
                throw new errorHandler_1.BadRequestError('User has already been followed');
            yield this.client.lpush(`followers:${followerId}`, userId);
            yield this.client.lpush(`following:${userId}`, followerId);
            // storing follower in hash for faster reteriving
            yield Promise.all([
                this.client.hset(`followersHash:${followerId}`, userId, '1'),
                this.client.hset(`followingsHash:${userId}`, followerId, '1'),
            ]);
            yield Promise.all([
                userCache_1.userCache.incrFollowCount(userId, 'followersCount', 1),
                userCache_1.userCache.incrFollowCount(followerId, 'followeeCount', 1),
            ]);
        });
    }
    removeFollowee(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { followerId, userId } = data;
            const unfollowUser = yield this.client.lrem(`followers:${userId}`, 1, followerId);
            const removeFollowing = yield this.client.lrem(`following:${followerId}`, 1, userId);
            yield this.client.hdel(`followersHash:${userId}`, followerId);
            yield this.client.hdel(`followingsHash:${followerId}`, userId);
            const decFollowerCount = userCache_1.userCache.incrFollowCount(userId, 'followersCount', -1);
            const decFolloweeCount = userCache_1.userCache.incrFollowCount(followerId, 'followeeCount', -1);
            yield Promise.all([unfollowUser, decFollowerCount, decFolloweeCount, removeFollowing]);
        });
    }
    getFollowers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followersIds = yield this.client.lrange(`followers:${userId}`, 0, -1);
            return followersIds;
        });
    }
    getFollowees(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followersIds = yield this.client.lrange(`following:${userId}`, 0, -1);
            return followersIds;
        });
    }
    getFollowData(followType, userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const followers = [];
            const followersIds = yield this.client.lrange(`${followType}:${userId}`, skip, limit);
            for (let followerId of followersIds) {
                const { followeeCount, followersCount, totalPost, profileImg, userName } = yield userCache_1.userCache.getUser(followerId);
                const followerData = {
                    followeeCount,
                    followersCount,
                    totalPost,
                    profileImg,
                    userId,
                    userName,
                };
                followers.push(followerData);
            }
            return followers;
        });
    }
}
exports.followerCache = new FollowerCache();
