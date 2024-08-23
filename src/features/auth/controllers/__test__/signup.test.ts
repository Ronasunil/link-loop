// MOCKS
jest.mock('@global/helpers/cloudinary', () => ({
  cloudinaryUploader: {
    imageUpload: jest.fn().mockResolvedValue({ public_id: 'sample' }),
  },
}));

import express from 'express';
import request from 'supertest';

import { App } from '@utils/app';
import { TestHelper } from '@global/helpers/testHelper';

const app = new App(express());

it('Signup successfull', async () => {
  await TestHelper.createUser('rona@gmail.com', 'ROna@5678');
});
it('validation failed', async () => {
  const avatarImage = 'C';
  await request(app.application)
    .post('/api/v1/signup')
    .send({
      userName: 'Rona',
      email: '',
      password: '',
      confirmPassword: '',
      avatarColor: 'red',
      avatarImage,
    })
    .expect(400);
});
