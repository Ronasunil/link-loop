"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSchema = exports.basicInfoSchema = exports.socialMediaSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.socialMediaSchema = joi_1.default.object({
    facebook: joi_1.default.string().optional().default('').allow('', null),
    instagram: joi_1.default.string().optional().default('').allow('', null),
});
exports.basicInfoSchema = joi_1.default.object({
    quote: joi_1.default.string().optional().allow('', null),
    string: joi_1.default.string().optional().allow('', null),
    school: joi_1.default.string().optional().allow('', null),
    job: joi_1.default.string().optional().allow('', null),
    location: joi_1.default.string().optional().allow('', null),
});
exports.notificationSchema = joi_1.default.object({
    onFollow: joi_1.default.boolean().optional().allow(null),
    onMessage: joi_1.default.boolean().optional().allow(null),
    onLike: joi_1.default.boolean().optional().allow(null),
    onComment: joi_1.default.boolean().optional().allow(null),
});
