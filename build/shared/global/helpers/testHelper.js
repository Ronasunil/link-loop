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
exports.TestHelper = void 0;
jest.mock('@workers/authWorker', () => ({
    AuthWorker: jest.fn().mockImplementation(() => {
        return {
            saveToDb: jest.fn().mockImplementation((data) => __awaiter(void 0, void 0, void 0, function* () {
                yield authModel_1.authModel.create(data);
            })),
        };
    }),
}));
jest.mock('@workers/signupWorker', () => ({
    SignupWorker: jest.fn().mockImplementation(() => {
        return {
            saveToDb: jest.fn().mockImplementation((data) => __awaiter(void 0, void 0, void 0, function* () {
                yield userModel_1.userModel.create(data);
            })),
        };
    }),
}));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const express_1 = __importDefault(require("express"));
const authModel_1 = require("../../../features/auth/models/authModel");
const userModel_1 = require("../../../features/users/models/userModel");
const app = new app_1.App((0, express_1.default)());
class TestHelper {
    static createUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatarImage = 'jkl';
            const res = yield (0, supertest_1.default)(app.application)
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
        });
    }
}
exports.TestHelper = TestHelper;
