jest.mock('@global/helpers/cloudinary', () => ({
  cloudinaryUploader: {
    imageUpload: jest.fn().mockResolvedValue({ public_id: 'sample' }),
  },
}));

import express from 'express';
import request from 'supertest';
import { App } from '@utils/app';

const app = new App(express());

it('signout successfull', async () => {
  await request(app.application).delete('/api/v1/signout').expect(204);
});
