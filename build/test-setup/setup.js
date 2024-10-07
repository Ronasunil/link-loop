"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const redis_mock_1 = __importDefault(require("redis-mock"));
const mongoose_1 = __importDefault(require("mongoose"));
let mongo;
let redisClient;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // setting mongodb for testing
    yield mongoose_1.default.disconnect();
    mongo = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = yield mongo.getUri();
    try {
        yield mongoose_1.default.connect(mongoUri);
        console.log('Connected to in-memory MongoDB');
    }
    catch (err) {
        console.log('Connection failed');
        console.log(err);
        process.exit(1);
    }
    // setting redis for testing
    redisClient = redis_mock_1.default.createClient();
    redisClient.on('connect', () => {
        console.log('Connected to in-memory Redis');
    });
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield mongoose_1.default.connection.db.collections();
    for (let collection of collections) {
        yield collection.deleteMany({});
    }
    redisClient.FLUSHALL();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongo.stop();
    // await mongoose.connection.close();
    redisClient.quit();
}));
jest.setTimeout(30000);
