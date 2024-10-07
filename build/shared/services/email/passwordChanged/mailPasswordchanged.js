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
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../../../../config");
const errorHandler_1 = require("../../../global/helpers/errorHandler");
class MailForgetPassword {
    developmentMailSender(emailBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: config_1.config.ETHEREAL_HOST,
                port: config_1.config.ETHEREAL_PORT,
                secure: false,
                auth: {
                    user: config_1.config.ETHEREAL_PASSWORD,
                    pass: config_1.config.ETHEREAL_PASSWORD,
                },
            });
            const mailOptions = {
                from: `"LinkLoop, Kerala 👻" <${config_1.config.ETHEREAL_EMAIL}>`,
                to: emailBody.to,
                subject: emailBody.subject,
                html: emailBody.body,
            };
            transporter.sendMail(mailOptions).catch((err) => {
                console.log(err);
                throw new errorHandler_1.BadRequestError('Something went wrong');
            });
        });
    }
    productionMailSender(emailBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `"LinkLoop, Kerala 👻" <${config_1.config.ETHEREAL_EMAIL}>`,
                to: emailBody.to,
                subject: emailBody.subject,
                html: emailBody.body,
            };
            yield mail_1.default.send(mailOptions).catch((err) => {
                console.log(err);
                throw new errorHandler_1.BadRequestError('Something went wrong');
            });
        });
    }
    sendMail(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.config.NODE_ENV === 'development')
                this.developmentMailSender(obj);
            else
                this.productionMailSender(obj);
        });
    }
}
