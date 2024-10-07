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
exports.userBlockManager = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const blockUserCache_1 = require("../../../shared/services/redis/blockUserCache");
const blockWorker_1 = require("../../../shared/workers/blockWorker");
class UserBlockManager {
    block(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blockUserId } = req.params;
            const userId = req.currentUser._id.toString();
            yield blockUserCache_1.blockUserCache.BlockUser(userId, blockUserId);
            const blockWorker = yield new blockWorker_1.BlockWorker().prepareQueueForBlock({ userId, blockUserId });
            blockWorker.blockUser();
            res.status(http_status_codes_1.default.OK).json({ message: 'User blocked' });
        });
    }
    unblock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { unblockUserId } = req.params;
            const userId = req.currentUser._id.toString();
            yield blockUserCache_1.blockUserCache.unblockUser(userId, unblockUserId);
            const blockWorker = yield new blockWorker_1.BlockWorker().prepareQueueForUnblock({ userId, unblockUserId });
            blockWorker.unblockUser();
            res.status(http_status_codes_1.default.OK).json({ message: 'User unblocked' });
        });
    }
}
exports.userBlockManager = new UserBlockManager();
