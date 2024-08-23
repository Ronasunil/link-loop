import { addMinutes } from 'date-fns';

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
}
