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
exports.get = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const reactionService_1 = require("../../../shared/services/db/reactionService");
const reactionCache_1 = require("../../../shared/services/redis/reactionCache");
const helpers_1 = require("../../../shared/global/helpers/helpers");
class Get {
    reaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { postId } = req.params;
            const pageNo = Number.parseInt(((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || '1');
            const { limit, skip } = helpers_1.Helpers.paginate(pageNo);
            const reactionDataCache = yield reactionCache_1.reactionCache.getReactionByPostId(postId, skip, limit);
            const reactions = reactionDataCache.length
                ? reactionDataCache
                : yield reactionService_1.ReactionService.getReactionByPostId(postId, skip, limit);
            res.status(http_status_codes_1.default.OK).json({ reactions });
        });
    }
}
exports.get = new Get();
