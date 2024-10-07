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
exports.authModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = require("bcrypt");
const authSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordResetExpires: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
        default: '',
    },
    avatarColor: {
        type: String,
    },
    avatarImage: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: {
        transform(_doc, ret) {
            delete ret.password;
        },
    },
});
authSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const userPassword = this.password;
        const isPasswordCorrect = yield (0, bcrypt_1.compare)(password, userPassword);
        return isPasswordCorrect;
    });
};
// prettier-ignore
authSchema.methods.hashPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, bcrypt_1.hash)(password, 12);
    });
};
authSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield this.hashPassword(this.password);
        next();
    });
});
exports.authModel = mongoose_1.default.model('Auth', authSchema);
