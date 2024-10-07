"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionType = void 0;
var reactionType;
(function (reactionType) {
    reactionType["like"] = "like";
    reactionType["sad"] = "sad";
    reactionType["laugh"] = "laugh";
    reactionType["wow"] = "wow";
    reactionType["angry"] = "angry";
})(reactionType || (exports.reactionType = reactionType = {}));
// export interface reqForGettingUserReaction {
//   params: {
//     authId: string;
//   };
//   query: {
//     page?: string;
//   };
// }
