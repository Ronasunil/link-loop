jest.mock('@workers/authWorker', () => ({
  AuthWorker: jest.fn().mockImplementation(() => {
    return {
      saveToDb: jest.fn().mockImplementation(async (data) => {
        await authModel.create(data);
      }),
    };
  }),
}));

jest.mock('@workers/signupWorker', () => ({
  SignupWorker: jest.fn().mockImplementation(() => {
    return {
      saveToDb: jest.fn().mockImplementation(async (data) => {
        await userModel.create(data);
      }),
    };
  }),
}));

import request from 'supertest';
import { App } from '@utils/app';
import express from 'express';
import { authModel } from '@utils/features/auth/models/authModel';
import { userModel } from '@utils/features/users/models/userModel';

const app = new App(express());

export class TestHelper {
  static async createUser(email: string, password: string): Promise<string[] | []> {
    const avatarImage = 'jkl';

    const res = await request(app.application)
      .post('/api/v1/signup')
      .send({
        userName: 'Rona',
        email,
        password,
        confirmPassword: password,
        avatarColor: 'red',
        avatarImage,
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    return cookie || [];
  }
}
