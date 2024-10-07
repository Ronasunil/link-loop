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
exports.reaction = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const helpers_1 = require("../../../shared/global/helpers/helpers");
const reactionCache_1 = require("../../../shared/services/redis/reactionCache");
const reactionWorker_1 = require("../../../shared/workers/reactionWorker");
const postSocket_1 = require("../../../features/sockets/postSocket");
class Reaction {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reactionId = helpers_1.Helpers.createObjectId();
            const data = Reaction.prototype.getReactionData(req, reactionId);
            postSocket_1.postSocketIo.emit('reaction', data);
            yield reactionCache_1.reactionCache.createReaction(data);
            const reactionWorker = yield new reactionWorker_1.ReactionWorker().prepareQueue(data);
            reactionWorker.createReaction();
            res.status(http_status_codes_1.default.OK).json({ message: 'Reaction successfully added', status: '0K' });
        });
    }
    getReactionData(req, _id) {
        const { postId, profilePic, reactionType, userName, userTo } = req.body;
        const authId = req.currentUser.authId;
        const userFrom = req.currentUser._id;
        return { postId, profilePic, reactionType, userName, _id, createdAt: new Date(), authId, userFrom, userTo };
    }
}
exports.reaction = new Reaction();
