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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../../app");
const testHelper_1 = require("../../../../shared/global/helpers/testHelper");
const app = new app_1.App((0, express_1.default)());
it('forgot password successfull', () => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = yield testHelper_1.TestHelper.createUser('rona@gmail.com', 'Sample@123');
    (0, supertest_1.default)(app.application)
        .post('/api/v1/forgotPassword')
        .set('Cookie', cookie)
        .send({ email: 'rona@gmail.com' })
        .expect(200);
}));
