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
const followerCache_1 = require("../../../shared/services/redis/followerCache");
class Get {
    userFollowers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const { page } = req.query;
            const pageNo = Number.parseInt(page || '1');
            const { limit, skip } = helpers_1.Helpers.paginate(pageNo);
            const followersCache = yield followerCache_1.followerCache.getFollowData('followers', userId, skip, limit);
            const followers = followersCache.length
                ? followersCache
                : yield followerService_1.FollowerService.getFollowData('followerId', userId, skip, limit);
            res.status(http_status_codes_1.default.OK).json({ followers });
        });
    }
    userFollowees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const { page } = req.query;
            const pageNo = Number.parseInt(page || '1');
            const { limit, skip } = helpers_1.Helpers.paginate(pageNo);
            const followeesCache = yield followerCache_1.followerCache.getFollowData('following', userId, skip, limit);
            const followees = followeesCache.length
                ? followeesCache
                : yield followerService_1.FollowerService.getFollowData('followeeId', userId, skip, limit);
            res.status(http_status_codes_1.default.OK).json({ followees });
        });
    }
}
exports.get = new Get();
