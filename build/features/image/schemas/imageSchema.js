"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.imageSchema = joi_1.default.object({
    image: joi_1.default.string().required().messages({
        'any.required': 'Image is required please provide one',
    }),
});
