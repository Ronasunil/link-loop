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
exports.reactionCache = exports.ReactionCache = void 0;
const baseCache_1 = require("./baseCache");
const postCache_1 = require("./postCache");
const errorHandler_1 = require("../../global/helpers/errorHandler");
class ReactionCache extends baseCache_1.BaseCache {
    constructor() {
        super();
    }
    getReaction(postId, authId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.hget(`reaction:${postId}`, authId);
        });
    }
    getReactionByPostId(postId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const reactions = [];
            let cursor = '0'; // Start cursor for HSCAN
            // Use HSCAN to iterate through the hash
            do {
                const [newCursor, items] = yield this.client.hscan(`reaction:${postId}`, cursor);
                cursor = newCursor;
                for (let i = 0; i < items.length; i += 2) {
                    if (skip > 0) {
                        skip--;
                        continue;
                    }
                    if (reactions.length < limit) {
                        const value = JSON.parse(items[i + 1]);
                        reactions.push(value);
                    }
                    else
                        return reactions;
                }
            } while (cursor !== '0');
            return reactions;
        });
    }
    createReaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, authId } = data;
            // check if updating the reaction
            const status = yield this.updateReaction(data);
            if (status)
                return;
            // check if its creating (it will create new reaction if no prev reaction exist)
            const reactionJson = JSON.stringify(data);
            yield this.client.hset(`reaction:${postId}`, authId.toString(), reactionJson);
            yield this.updatePostBasedonReaction(data, 'inc');
        });
    }
    updateReaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, authId } = data;
            // check if reaction exist
            const reactionJson = yield this.getReaction(postId.toString(), authId.toString());
            if (!reactionJson)
                return false;
            // reaction exist
            const reaction = JSON.parse(reactionJson);
            // deleting when user has selected same reaction twice
            if (reaction.reactionType === data.reactionType) {
                yield this.deleteReaction(data);
                this.updatePostBasedonReaction(data, 'dec');
                return true;
            }
            // updating existing reaction
            const updatedReactionJson = JSON.stringify(Object.assign(Object.assign({}, reaction), { reactionType: data.reactionType }));
            yield this.client.hset(`reaction:${postId}`, authId.toString(), updatedReactionJson);
            this.updatePostBasedonReaction(data, 'inc', reaction.reactionType);
            return true;
        });
    }
    deleteReaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, authId } = data;
            yield this.client.hdel(`reaction:${postId}`, authId.toString());
        });
    }
    getUpdatedReaction(userReaction, reactions, type) {
        reactions[userReaction] = type === 'dec' ? reactions[userReaction] - 1 : reactions[userReaction] + 1;
        return reactions;
    }
    updatePostBasedonReaction(data, type, prevReaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, reactionType, profilePic } = data;
            const post = yield postCache_1.postCache.getPost(postId);
            if (!post)
                throw new errorHandler_1.NotFoundError(`Post based on this id:${postId} is not avialable`);
            let reactions = post.reactions;
            if (prevReaction) {
                const reactions = this.getUpdatedReaction(prevReaction, post.reactions, 'dec');
                this.getUpdatedReaction(reactionType, reactions, 'inc');
                return postCache_1.postCache.updatePost(postId.toString(), { reactions, profilePic, totalReaction: post.totalReaction });
            }
            reactions = this.getUpdatedReaction(reactionType, post.reactions, type);
            let totalReaction = type === 'dec' ? (post.totalReaction -= 1) : (post.totalReaction += 1);
            yield postCache_1.postCache.updatePost(postId.toString(), { reactions, totalReaction });
        });
    }
}
exports.ReactionCache = ReactionCache;
exports.reactionCache = new ReactionCache();
