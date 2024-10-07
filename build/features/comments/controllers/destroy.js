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
exports.destroy = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const commentCache_1 = require("../../../shared/services/redis/commentCache");
const commentWorker_1 = require("../../../shared/workers/commentWorker");
class Destory {
    comment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { commentId, postId } = req.params;
            yield commentCache_1.commentCache.deleteComment(postId, commentId);
            const commentWorker = yield new commentWorker_1.CommentWorker().prepareQueueForDeletion({ postId, commentId });
            commentWorker.deleteComment();
            res.status(http_status_codes_1.default.NO_CONTENT).json({ message: 'Deleted successfully' });
        });
    }
}
exports.destroy = new Destory();
