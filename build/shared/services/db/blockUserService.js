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
exports.BlockUserService = void 0;
const userModel_1 = require("../../../features/users/models/userModel");
class BlockUserService {
    static blockUser(userId, blockUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.userModel.bulkWrite([
                {
                    updateOne: { filter: { _id: userId }, update: { $addToSet: { blocked: blockUserId } } },
                },
                {
                    updateOne: { filter: { _id: blockUserId }, update: { $addToSet: { blockedBy: userId } } },
                },
            ]);
        });
    }
    static unBlockUser(userId, unBlockUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.userModel.bulkWrite([
                {
                    updateOne: { filter: { _id: userId }, update: { $pull: { blocked: unBlockUserId } } },
                },
                {
                    updateOne: { filter: { _id: unBlockUserId }, update: { $pull: { blockedBy: userId } } },
                },
            ]);
        });
    }
}
exports.BlockUserService = BlockUserService;
