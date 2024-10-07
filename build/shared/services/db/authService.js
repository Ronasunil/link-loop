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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const authModel_1 = require("../../../features/auth/models/authModel");
const config_1 = require("../../../config");
const userModel_1 = require("../../../features/users/models/userModel");
const helpers_1 = require("../../global/helpers/helpers");
class AuthService {
    static getAuthByEmailOrUsername(userName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield authModel_1.authModel.findOne({ $or: [{ userName }, { email }] });
            return user;
        });
    }
    static getAuthbyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield authModel_1.authModel.findById(id);
        });
    }
    static getUserByAuthId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.userModel.findOne({ authId: id });
        });
    }
    static getUserByid(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.userModel.findById(id).populate('authId');
        });
    }
    static signToken(authData) {
        const { _id, userName, avatarImage, email, authId } = authData;
        return jsonwebtoken_1.default.sign({ _id, userName, avatarImage, email, authId }, config_1.config.JWT_SECRET);
    }
    static getAuthByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield authModel_1.authModel.findOne({ email });
        });
    }
    static updatePasswordToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = crypto_1.default.randomBytes(10).toString('hex');
            yield authModel_1.authModel.findByIdAndUpdate(id, { passwordResetToken: token, passwordResetExpires: helpers_1.Helpers.thirtyMinAddedTime() }, { new: true, runValidators: true });
            return { token };
        });
    }
    static getAuthByResetToken(resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield authModel_1.authModel.findOne({
                passwordResetToken: resetToken,
                passwordResetExpires: { $gt: new Date().toUTCString() },
            });
        });
    }
}
exports.AuthService = AuthService;
