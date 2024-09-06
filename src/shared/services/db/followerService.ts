import { dbFolloweAttr } from '@follower/interfaces/followerInterface';
import { followerModel } from '@follower/models/followerModel';
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

    await Promise.all([followerCreation, updatingFollowerCount]);
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
