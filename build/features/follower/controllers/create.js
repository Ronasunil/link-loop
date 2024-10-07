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
exports.follow = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const followerCache_1 = require("../../../shared/services/redis/followerCache");
const userCache_1 = require("../../../shared/services/redis/userCache");
const followerSocket_1 = require("../../../features/sockets/followerSocket");
const followerWorker_1 = require("../../../shared/workers/followerWorker");
class Follow {
    followuser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { followerId } = req.params;
            const userId = req.currentUser._id.toString();
            yield followerCache_1.followerCache.addFollowee({ followerId, userId });
            const user = yield userCache_1.userCache.getUser(userId);
            const socketData = Follow.prototype.followData(user, followerId);
            followerSocket_1.followerSocketIo.emit('add follower', socketData);
            const followerWorker = yield new followerWorker_1.FollowerWorker().prepareQueueForFollowing({ followerId, userId });
            followerWorker.follow();
            res.status(http_status_codes_1.default.OK).json({ message: 'User has been followed', status: 'OK' });
        });
    }
    followData(userData, followerId) {
        return {
            followeeCount: userData.followeeCount,
            followersCount: userData.followersCount,
            totalPost: userData.totalPost,
            profileImg: userData.profileImg,
            userId: userData._id.toString(),
            followerId,
        };
    }
}
exports.follow = new Follow();
