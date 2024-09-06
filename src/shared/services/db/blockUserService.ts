import { userModel } from '@utils/features/users/models/userModel';

export class BlockUserService {
  static async blockUser(userId: string, blockUserId: string) {
    await userModel.bulkWrite([
      {
        updateOne: { filter: { _id: userId }, update: { $addToSet: { blocked: blockUserId } } },
      },

      {
        updateOne: { filter: { _id: blockUserId }, update: { $addToSet: { blockedBy: userId } } },
      },
    ]);
  }

  static async unBlockUser(userId: string, unBlockUserId: string) {
    await userModel.bulkWrite([
      {
        updateOne: { filter: { _id: userId }, update: { $pull: { blocked: unBlockUserId } } },
      },

      {
        updateOne: { filter: { _id: unBlockUserId }, update: { $pull: { blockedBy: userId } } },
      },
    ]);
  }
}
