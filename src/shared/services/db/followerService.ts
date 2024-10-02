import { dbFolloweAttr, followerDoc } from '@follower/interfaces/followerInterface';
import { followerModel } from '@follower/models/followerModel';
import { notification } from '@notification/interfaces/notificationInterface';
import { notificationModel } from '@notification/model/notificationModel';
import { notificationSocket } from '@utils/features/sockets/notificationSocket';
import { userDoc } from '@utils/features/users/interface/user.interface';
import { userModel } from '@utils/features/users/models/userModel';

export class FollowerService {
  static async addFollowerDb(data: dbFolloweAttr) {
    const { followerId, userId } = data;
    const followerCreation = followerModel.create({ followerId, followeeId: userId });

    const updatingFollowerCount = userModel.bulkWrite([
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

    const [follower, user] = await Promise.all([
      followerCreation,
      userModel.findById(followerId),
      updatingFollowerCount,
    ]);

    if (user && user.userSettings.notificationSettings.onComment && followerId !== userId) {
      // create notification
      const notification = new notificationModel();
      const notificationData = FollowerService.prototype.getNotificationData(user, follower);
      await notification.insertNotification(notificationData);

      // emit socket notification
      notificationSocket.emit('addedd notification', notificationData, { userTo: follower.followerId });
    }
  }

  private getNotificationData(user: userDoc, follower: followerDoc): notification {
    return {
      comment: '',
      createdAt: new Date(),
      createdItemId: follower._id.toString(),
      entityId: user._id.toString(),
      imageId: '',
      imageVersion: '',
      message: `${user.userName} commented on this post`,
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

  static async removeFollowerDb(data: dbFolloweAttr) {
    console.log('coming hereeeee removing');
    const { followerId, userId } = data;
    const removeFollower = followerModel.deleteOne({ followerId, followeeId: userId });

    const updatingFollowerCount = userModel.bulkWrite([
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

    await Promise.all([removeFollower, updatingFollowerCount]);
  }

  static async getFollowData(followType: 'followerId' | 'followeeId', userId: string, skip: number, limit: number) {
    const followers = await followerModel
      .find({ [followType]: userId })
      .populate(followType)
      .select(followType)
      .skip(skip)
      .limit(limit);

    return followers;
  }
}
