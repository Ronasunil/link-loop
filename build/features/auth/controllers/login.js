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
exports.login = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const errorHandler_1 = require("../../../shared/global/helpers/errorHandler");
const authService_1 = require("../../../shared/services/db/authService");
class Login {
    authenticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email, username } = req.body;
            // get auth and validating existence
            const auth = yield authService_1.AuthService.getAuthByEmailOrUsername(username || '', email || '');
            if (!auth)
                throw new errorHandler_1.NotAuthorizedError('Invalid credentials');
            // get user and validating existence
            const user = yield authService_1.AuthService.getUserByAuthId(auth._id);
            if (!user)
                return new errorHandler_1.NotAuthorizedError('Invalid credentials');
            // validating  password
            const isPasswordValid = yield auth.comparePassword(password);
            if (!isPasswordValid)
                throw new errorHandler_1.NotAuthorizedError('Invalid credentials');
            // assigning cookie
            const token = authService_1.AuthService.signToken(Login.prototype.getTokenPaylod(auth, user));
            req.session = { token };
            res.status(http_status_codes_1.default.OK).json({ message: 'Login successfull', user });
        });
    }
    getTokenPaylod(data, userData) {
        const { userName, email, avatarImage, _id } = data;
        return { userName, email, _id: userData._id, avatarImage, authId: _id };
    }
}
exports.login = new Login();
