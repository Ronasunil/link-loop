class Helpers {
  static generateRandomNum(len: number) {
    const numbers = '123456789';
    let res: string = '';
    for (let i = 0; i <= len; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);

      res += numbers[randomIndex];
    }

    return res;
  }
}
