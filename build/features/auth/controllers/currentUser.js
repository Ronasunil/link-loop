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
exports.curentUser = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const authService_1 = require("../../../shared/services/db/authService");
const userCache_1 = require("../../../shared/services/redis/userCache");
const errorHandler_1 = require("../../../shared/global/helpers/errorHandler");
class CurrentUser {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const cacheUser = yield new userCache_1.UserCache().getUser((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a._id);
            const user = cacheUser ? cacheUser : authService_1.AuthService.getUserByid((_b = req.currentUser) === null || _b === void 0 ? void 0 : _b._id);
            console.log('here');
            if (!user)
                throw new errorHandler_1.NotAuthorizedError('Unauthorized access');
            res.status(http_status_codes_1.default.OK).json({ user });
        });
    }
}
exports.curentUser = new CurrentUser();
