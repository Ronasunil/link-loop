// MOCKS
jest.mock('@global/helpers/cloudinary', () => ({
  cloudinaryUploader: {
    imageUpload: jest.fn().mockResolvedValue({ public_id: 'sample' }),
  },
}));

import request from 'supertest';
import express from 'express';

import { TestHelper } from '@global/helpers/testHelper';
import { App } from '@utils/app';

const app = new App(express());

it('login successfull', async () => {
  await TestHelper.createUser('rona@gmail.com', 'Rona@1234');

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const res = request(app.application)
    .post('/api/v1/login')
    .send({ email: 'rona@gmail.com', password: 'Rona@1234' })
    .expect(200);

  console.log((await res).body);
});

it('login failed', async () => {
  await request(app.application)
    .post('/api/v1/login')
    .send({ email: 'ronaa@gmail.com', password: 'Rona@1234545' })
    .expect(401);
});
