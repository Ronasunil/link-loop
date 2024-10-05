import { config } from '@utils/config';
import { redisUserAttrs, userDoc } from '@utils/features/users/interface/user.interface';
import { addMinutes } from 'date-fns';
import mongoose from 'mongoose';

export class Helpers {
  static generateRandomNum(len: number) {
    const numbers = '123456789';
    let res: string = '';
    for (let i = 0; i <= len; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);

      res += numbers[randomIndex];
    }

    return res;
  }

  static thirtyMinAddedTime() {
    const now = new Date();
    const futureTime = addMinutes(now, 30);

    return futureTime.toUTCString();
  }

  static createObjectId() {
    return new mongoose.Types.ObjectId();
  }

  static paginate(pageNo: number): { skip: number; limit: number } {
    const skip = (pageNo - 1) * config.PAGE_lIMIT!;
    const limit = pageNo * config.PAGE_lIMIT!;

    return { skip, limit };
  }

  static suffleArray(array: redisUserAttrs[] | userDoc[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const index = Math.floor(Math.random() * (i + 1));
      [array[i], array[index]] = [array[index], array[i]];
    }

    return array;
  }
}
