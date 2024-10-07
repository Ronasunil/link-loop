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
// MOCKS
jest.mock('@global/helpers/cloudinary', () => ({
    cloudinaryUploader: {
        imageUpload: jest.fn().mockResolvedValue({ public_id: 'sample' }),
    },
}));
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const testHelper_1 = require("../../../../shared/global/helpers/testHelper");
const app_1 = require("../../../../app");
const app = new app_1.App((0, express_1.default)());
it('login successfull', () => __awaiter(void 0, void 0, void 0, function* () {
    yield testHelper_1.TestHelper.createUser('rona@gmail.com', 'Rona@1234');
    yield new Promise((resolve) => setTimeout(resolve, 3000));
    const res = (0, supertest_1.default)(app.application)
        .post('/api/v1/login')
        .send({ email: 'rona@gmail.com', password: 'Rona@1234' })
        .expect(200);
    console.log((yield res).body);
}));
it('login failed', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app.application)
        .post('/api/v1/login')
        .send({ email: 'ronaa@gmail.com', password: 'Rona@1234545' })
        .expect(401);
}));
