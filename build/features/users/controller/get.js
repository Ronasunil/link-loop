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
exports.get = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const helpers_1 = require("../../../shared/global/helpers/helpers");
const followerService_1 = require("../../../shared/services/db/followerService");
const userService_1 = require("../../../shared/services/db/userService");
const followerCache_1 = require("../../../shared/services/redis/followerCache");
const userCache_1 = require("../../../shared/services/redis/userCache");
const postService_1 = require("../../../shared/services/db/postService");
class Get {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.query;
            const pageNo = +page || 1;
            const userId = req.currentUser._id.toString();
            const { skip, limit } = helpers_1.Helpers.paginate(pageNo);
            const totalUsersCache = yield userCache_1.userCache.getAllusers(userId, skip, limit);
            const followersCache = yield followerCache_1.followerCache.getFollowers(userId);
            const totalUsersCountCache = yield userCache_1.userCache.getTotalUser();
            const totalUsers = totalUsersCache.length ? totalUsersCache : yield userService_1.UserService.getAllUsers(userId, skip, limit);
            const followers = followersCache.length ? followersCache : yield followerService_1.FollowerService.getFollowers(userId);
            const totalUsersCount = totalUsersCountCache ? totalUsersCountCache : yield userService_1.UserService.getTotalUsersCount();
            res
                .status(http_status_codes_1.default.OK)
                .json({ message: 'Total users', users: totalUsers, followers, totalUsers: totalUsersCount });
        });
    }
    searchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.query;
            const result = yield userService_1.UserService.searchUsers(query);
            res.status(http_status_codes_1.default.OK).json({ message: 'Searched users', users: result });
        });
    }
    getUserProfileAndPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authId, userId } = req.params;
            const { page } = req.query;
            const pageNo = +page || 1;
            const { limit, skip } = helpers_1.Helpers.paginate(pageNo);
            const { posts: cachePosts, user: cacheUser } = yield userCache_1.userCache.getUserProfileAndPost(userId, authId, skip, limit);
            const posts = cachePosts.length ? cachePosts : yield postService_1.PostService.getPostbyAuthIdDb(authId, skip, limit);
            const user = cacheUser ? cacheUser : yield userService_1.UserService.getUser(userId);
            res.status(http_status_codes_1.default.OK).json({ message: 'User with posts', user, posts });
        });
    }
    getRandomUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = req.query;
            const pageNo = +page || 1;
            const { skip, limit } = helpers_1.Helpers.paginate(pageNo);
            console.log(skip);
            const userId = req.currentUser._id.toString();
            const randomUsersCache = yield userCache_1.userCache.getRandomUserSuggestion(userId, skip, limit);
            const randomUsers = randomUsersCache.length
                ? randomUsersCache
                : yield userService_1.UserService.getRandomUserSuggestionDb(userId, skip, limit);
            res.status(http_status_codes_1.default.OK).json({ message: 'Random users', users: randomUsers });
        });
    }
}
exports.get = new Get();
