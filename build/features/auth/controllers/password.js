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
exports.password = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const request_ip_1 = __importDefault(require("request-ip"));
const errorHandler_1 = require("../../../shared/global/helpers/errorHandler");
const authService_1 = require("../../../shared/services/db/authService");
const config_1 = require("../../../config");
const passwordChangedMailWorker_1 = require("../../../shared/workers/passwordChangedMailWorker");
const resetPasswordMailWorker_1 = require("../../../shared/workers/resetPasswordMailWorker");
const date_fns_1 = require("date-fns");
const authModel_1 = require("../models/authModel");
class Password {
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const auth = yield authService_1.AuthService.getAuthByEmail(email);
            if (!auth)
                throw new errorHandler_1.BadRequestError('Please signup');
            // adding password token and its expiration
            const { token } = yield authService_1.AuthService.updatePasswordToken(auth._id);
            // sending mail
            new resetPasswordMailWorker_1.ResetPasswordMailWorker().prepareQueue({ subject: 'Action Required: Reset Your Password', to: auth.email, body: '' }, { resetLink: `${config_1.config.CLIENT_URL}/resetToken/${token}`, username: auth.userName });
            res.status(http_status_codes_1.default.OK).json({ message: 'Email sent' });
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = req.body;
            const { resetToken } = req.params;
            const ipaddress = request_ip_1.default.getClientIp(req) || '';
            const auth = yield authService_1.AuthService.getAuthByResetToken(resetToken);
            if (!auth)
                throw new errorHandler_1.BadRequestError('Token expired');
            auth.set({ password, passwordResetExpires: undefined, passwordResetToken: undefined });
            yield auth.save({ validateBeforeSave: true });
            res.status(http_status_codes_1.default.OK).json({ message: 'Password successfully changed' });
            new passwordChangedMailWorker_1.PasswordChangedMailWorker().prepareQueue({ body: '', subject: 'Password Change Confirmation', to: auth.email }, { ipaddress, date: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd'), email: auth.email, username: auth.userName });
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { confirmPassword, currentPassword } = req.body;
            const authId = req.currentUser.authId;
            const auth = yield authModel_1.authModel.findById(authId);
            if (!auth)
                throw new errorHandler_1.NotFoundError(`Auth regarding this id:${authModel_1.authModel} not found`);
            const isPasswordValid = yield auth.comparePassword(currentPassword);
            if (!isPasswordValid)
                throw new errorHandler_1.BadRequestError('Invalid password');
            auth.set({ password: confirmPassword });
            yield auth.save();
            res.status(http_status_codes_1.default.OK).json({ message: 'Password changed' });
        });
    }
}
exports.password = new Password();
