"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = void 0;
const config_1 = require("../../../config");
const date_fns_1 = require("date-fns");
const mongoose_1 = __importDefault(require("mongoose"));
class Helpers {
    static generateRandomNum(len) {
        const numbers = '123456789';
        let res = '';
        for (let i = 0; i <= len; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            res += numbers[randomIndex];
        }
        return res;
    }
    static thirtyMinAddedTime() {
        const now = new Date();
        const futureTime = (0, date_fns_1.addMinutes)(now, 30);
        return futureTime.toUTCString();
    }
    static createObjectId() {
        return new mongoose_1.default.Types.ObjectId();
    }
    static paginate(pageNo) {
        const skip = (pageNo - 1) * config_1.config.PAGE_lIMIT;
        const limit = pageNo * config_1.config.PAGE_lIMIT;
        return { skip, limit };
    }
    static suffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const index = Math.floor(Math.random() * (i + 1));
            [array[i], array[index]] = [array[index], array[i]];
        }
        return array;
    }
}
exports.Helpers = Helpers;
