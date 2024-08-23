// MOCK
jest.mock('@global/helpers/cloudinary', () => ({
  cloudinaryUploader: {
    imageUpload: jest.fn().mockResolvedValue({ public_id: 'sample' }),
  },
}));

jest.mock('@workers/resetPasswordMailWorker', () => {
  return {
    esetPasswordMailWorker: jest.fn().mockImplementation(() => {
      return { prepareQueue: jest.fn() };
    }),
  };
});

import express from 'express';
import request from 'supertest';

import { App } from '@utils/app';
import { TestHelper } from '@global/helpers/testHelper';

const app = new App(express());

it('forgot password successfull', async () => {
  const cookie = await TestHelper.createUser('rona@gmail.com', 'Sample@123');
  request(app.application)
    .post('/api/v1/forgotPassword')
    .set('Cookie', cookie)
    .send({ email: 'rona@gmail.com' })
    .expect(200);
});
