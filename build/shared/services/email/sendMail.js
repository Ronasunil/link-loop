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
exports.SendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const errorHandler_1 = require("../../global/helpers/errorHandler");
const config_1 = require("../../../config");
class SendMail {
    constructor(emailBody) {
        this.emailBody = emailBody;
        this.mailOptions = {
            from: `"LinkLoop, Kerala 👻" <${config_1.config.ETHEREAL_EMAIL}>`,
            to: emailBody.to,
            subject: emailBody.subject,
            html: emailBody.body,
        };
    }
    developmentMailSender() {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: config_1.config.ETHEREAL_HOST,
                port: config_1.config.ETHEREAL_PORT,
                secure: false,
                auth: {
                    user: config_1.config.ETHEREAL_EMAIL,
                    pass: config_1.config.ETHEREAL_PASSWORD,
                },
            });
            transporter.sendMail(this.mailOptions).catch((err) => {
                console.log(err);
                throw new errorHandler_1.BadRequestError('Something went wrong');
            });
        });
    }
    productionMailSender() {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: config_1.config.BREVO_HOST,
                port: config_1.config.BREVO_PORT,
                secure: false,
                auth: {
                    user: config_1.config.BREVO_EMAIL,
                    pass: config_1.config.BREVO_PASSWORD,
                },
            });
            transporter.sendMail(this.mailOptions).catch((err) => {
                console.log(err);
                throw new errorHandler_1.BadRequestError('Something went wrong');
            });
        });
    }
    sendMail() {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.config.NODE_ENV === 'development')
                this.developmentMailSender();
            else
                this.productionMailSender();
        });
    }
}
exports.SendMail = SendMail;
