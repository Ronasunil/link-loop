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
exports.FollowerService = void 0;
const followerModel_1 = require("../../../features/follower/models/followerModel");
const notificationModel_1 = require("../../../features/notification/model/notificationModel");
const notificationSocket_1 = require("../../../features/sockets/notificationSocket");
const userModel_1 = require("../../../features/users/models/userModel");
class FollowerService {
    static addFollowerDb(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { followerId, userId } = data;
            const followerCreation = followerModel_1.followerModel.create({ followerId, followeeId: userId });
            const updatingFollowerCount = userModel_1.userModel.bulkWrite([
                {
                    updateOne: {
                        filter: {
                            _id: userId,
                        },
                        update: { $inc: { followeeCount: 1 } },
                    },
                },
                {
                    updateOne: {
                        filter: {
                            _id: followerId,
                        },
                        update: { $inc: { followersCount: 1 } },
                    },
                },
            ]);
            const [follower, user] = yield Promise.all([
                followerCreation,
                userModel_1.userModel.findById(followerId),
                updatingFollowerCount,
            ]);
            if (user && user.userSettings.notificationSettings.onComment && followerId !== userId) {
                // create notification
                const notification = new notificationModel_1.notificationModel();
                const notificationData = FollowerService.prototype.getNotificationData(user, follower);
                yield notification.insertNotification(notificationData);
                // emit socket notification
                notificationSocket_1.notificationSocket.emit('addedd notification', notificationData, { userTo: follower.followerId });
            }
        });
    }
    getNotificationData(user, follower) {
        return {
            comment: '',
            createdAt: new Date(),
            createdItemId: follower._id.toString(),
            entityId: user._id.toString(),
            imageId: '',
            imageVersion: '',
            message: `${user.name} commented on this post`,
            notificationType: 'follow',
            post: '',
            reaction: '',
            chat: '',
            read: false,
            userFrom: follower.followeeId,
            userTo: follower.followerId,
            profileImg: user.profileImg,
        };
    }
    static removeFollowerDb(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('coming hereeeee removing');
            const { followerId, userId } = data;
            const removeFollower = followerModel_1.followerModel.deleteOne({ followerId, followeeId: userId });
            const updatingFollowerCount = userModel_1.userModel.bulkWrite([
                {
                    updateOne: {
                        filter: {
                            _id: userId,
                        },
                        update: {
                            $inc: {
                                followeeCount: -1,
                            },
                        },
                        upsert: false,
                    },
                },
                {
                    updateOne: {
                        filter: {
                            _id: followerId,
                        },
                        update: { $inc: { followersCount: -1 } },
                        upsert: false,
                    },
                },
            ]);
            yield Promise.all([removeFollower, updatingFollowerCount]);
        });
    }
    static getFollowers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followers = yield followerModel_1.followerModel.find({ followerId: userId }).populate('followeeId').select('followerId');
            return followers;
        });
    }
    static getFollowingsIds(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followings = yield followerModel_1.followerModel.find({ followeeId: userId });
            return followings.map((f) => f.followerId.toString());
        });
    }
    static getFollowData(followType, userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const populationField = followType === 'followerId' ? 'followeeId' : 'followerId';
            const followers = yield followerModel_1.followerModel
                .find({ [followType]: userId })
                .populate(populationField)
                .select(populationField)
                .skip(skip)
                .limit(limit);
            return followers;
        });
    }
}
exports.FollowerService = FollowerService;
