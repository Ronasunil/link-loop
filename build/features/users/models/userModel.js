"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../../config");
const userSchema = new mongoose_1.default.Schema({
    authId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Auth',
        index: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dob: {
        type: Date,
    },
    followersCount: {
        type: Number,
        default: 0,
    },
    followeeCount: {
        type: Number,
        default: 0,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    userSettings: {
        storySettings: {
            visibleForFollowers: Boolean,
            visibleForUserOnly: Boolean,
        },
        postSettings: {
            unlisted: {
                type: Boolean,
                default: false,
            },
            public: {
                type: Boolean,
                default: true,
            },
            private: {
                type: Boolean,
                default: false,
            },
        },
        notificationSettings: {
            onFollow: {
                type: Boolean,
                default: true,
            },
            onMessage: {
                type: Boolean,
                default: true,
            },
            onLike: {
                type: Boolean,
                default: true,
            },
            onComment: {
                type: Boolean,
                default: true,
            },
        },
    },
    socialMediaLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
    },
    basicInfo: {
        quote: { type: String, default: '' },
        school: { type: String, default: '' },
        job: { type: String, default: '' },
        location: { type: String, default: '' },
    },
    totalPost: {
        type: Number,
        default: 0,
    },
    profileImg: {
        type: String,
        default: config_1.config.DEFAULT_PROFILE_IMG,
    },
    bgImg: {
        type: String,
        default: '',
    },
    blocked: [{ type: mongoose_1.default.Types.ObjectId, ref: 'User' }],
    blockedBy: [{ type: mongoose_1.default.Types.ObjectId, ref: 'User' }],
});
exports.userModel = mongoose_1.default.model('User', userSchema);
