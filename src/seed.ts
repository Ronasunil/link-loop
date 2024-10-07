import { faker } from '@faker-js/faker';
import { createCanvas } from 'canvas';
import env from 'dotenv';
import axios from 'axios';

import { config } from './config';

env.config({ path: '../config.env' });

class Seed {
  private createUsername(): string {
    return faker.internet.userName();
  }

  private createEmail(): string {
    return faker.internet.email();
  }

  private genearateRandomColors(): string {
    const colors = [
      '#e6194b',
      '#3cb44b',
      '#ffe119',
      '#4363d8',
      '#f58231',
      '#911eb4',
      '#46f0f0',
      '#f032e6',
      '#bcf60c',
      '#fabebe',
      '#008080',
      '#e6beff',
      '#9a6324',
      '#fffac8',
      '#800000',
      '#aaffc3',
      '#808000',
      '#ffd8b1',
      '#000075',
      '#808080',
      '#000000',
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  private createAvatarImage(name: string, avatarColor: string) {
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = avatarColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '60px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  }

  private createUser() {
    const username = this.createUsername();
    const avatarColor = this.genearateRandomColors();
    const user = {
      userName: username,
      email: this.createEmail(),
      password: 'Dummy$password2',
      confirmPassword: 'Dummy$password2',
      avatarColor,
      avatarImage: this.createAvatarImage(username[0].toUpperCase(), avatarColor),
    };

    return user;
  }

  async seed(count: number): Promise<void> {
    const user = this.createUser();
    try {
      for (let i = 0; i < count; i++) {
        const res = await axios.post(`${config.SERVER_URL}/api/v1/signup`, user);
        console.log(`User ${i + 1} with username of ${res.data.user.name} created`);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

new Seed().seed(10);
