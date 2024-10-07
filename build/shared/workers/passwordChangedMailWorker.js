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
exports.PasswordChangedMailWorker = void 0;
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = require("../services/email/sendMail");
const mailQueue_1 = require("../services/queue/mailQueue");
class PasswordChangedMailWorker {
    constructor() {
        this.mailQueue = new mailQueue_1.MailQueue('passwordChangedQueue');
        this.mailQueue.processQueue(this.sendMail);
    }
    prepareQueue(data, userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const templatePath = path_1.default.join(`${__dirname}/../services/email/passwordChanged/passwordChangedTemplate.ejs`);
            const body = yield ejs_1.default.renderFile(templatePath, userDetails);
            this.mailQueue.addToQueue(Object.assign(Object.assign({}, data), { body }));
        });
    }
    sendMail(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = job.data;
            yield new sendMail_1.SendMail(data).sendMail();
        });
    }
}
exports.PasswordChangedMailWorker = PasswordChangedMailWorker;
