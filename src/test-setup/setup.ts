import { MongoMemoryServer } from 'mongodb-memory-server';
import Redis from 'redis-mock';

import mongoose from 'mongoose';

let mongo: MongoMemoryServer;
let redisClient: ReturnType<typeof Redis.createClient>;

beforeAll(async () => {
  // setting mongodb for testing
  await mongoose.disconnect();
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to in-memory MongoDB');
  } catch (err) {
    console.log('Connection failed');
    console.log(err);
    process.exit(1);
  }

  // setting redis for testing
  redisClient = Redis.createClient();

  redisClient.on('connect', () => {
    console.log('Connected to in-memory Redis');
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }

  redisClient.FLUSHALL();
});

afterAll(async () => {
  await mongo.stop();
  // await mongoose.connection.close();

  redisClient.quit();
});

jest.setTimeout(30000);
