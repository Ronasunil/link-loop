"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Signout {
    delete(req, res) {
        req.session = null;
        res.status(http_status_codes_1.default.NO_CONTENT).json({});
    }
}
exports.signout = new Signout();
