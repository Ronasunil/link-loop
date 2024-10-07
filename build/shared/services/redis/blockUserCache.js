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
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUserCache = void 0;
const _ = require('lodash');
const baseCache_1 = require("./baseCache");
const userCache_1 = require("./userCache");
class BlockUserCache extends baseCache_1.BaseCache {
    constructor() {
        super();
    }
    BlockUser(userId, blockUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId, blockUserId, 'pppp');
            const [user, blockingUser] = yield Promise.all([userCache_1.userCache.getUser(userId), userCache_1.userCache.getUser(blockUserId)]);
            const blocked = user.blocked;
            const blockedBy = blockingUser.blockedBy;
            blocked.push(blockUserId);
            blockedBy.push(userId);
            const updatedUser = JSON.stringify(Object.assign(Object.assign({}, user), { blocked }));
            const updatedBlockingUser = JSON.stringify(Object.assign(Object.assign({}, blockingUser), { blockedBy }));
            yield Promise.all([
                this.client.set(`user:${userId}`, updatedUser),
                this.client.set(`user:${blockUserId}`, updatedBlockingUser),
            ]);
        });
    }
    unblockUser(userId, unBlockUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user, unBlockingUser] = yield Promise.all([userCache_1.userCache.getUser(userId), userCache_1.userCache.getUser(unBlockUserId)]);
            const blocked = user.blocked;
            const blockedBy = unBlockingUser.blockedBy;
            _.remove(blocked, (id) => id === unBlockUserId);
            _.remove(blockedBy, (id) => id === userId);
            const updatedUser = JSON.stringify(Object.assign(Object.assign({}, user), { blocked }));
            const updatedUnblockingUser = JSON.stringify(Object.assign(Object.assign({}, unBlockingUser), { blockedBy }));
            yield Promise.all([
                this.client.set(`user:${userId}`, updatedUser),
                this.client.set(`user:${unBlockUserId}`, updatedUnblockingUser),
            ]);
        });
    }
}
exports.blockUserCache = new BlockUserCache();
