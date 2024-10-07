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
const faker_1 = require("@faker-js/faker");
const canvas_1 = require("canvas");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
dotenv_1.default.config({ path: '../config.env' });
class Seed {
    createUsername() {
        return faker_1.faker.internet.userName();
    }
    createEmail() {
        return faker_1.faker.internet.email();
    }
    genearateRandomColors() {
        const colors = [
            '#e6194b',
            '#3cb44b',
            '#ffe119',
            '#4363d8',
            '#f58231',
            '#911eb4',
            '#46f0f0',
            '#f032e6',
            '#bcf60c',
            '#fabebe',
            '#008080',
            '#e6beff',
            '#9a6324',
            '#fffac8',
            '#800000',
            '#aaffc3',
            '#808000',
            '#ffd8b1',
            '#000075',
            '#808080',
            '#000000',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    createAvatarImage(name, avatarColor) {
        const canvas = (0, canvas_1.createCanvas)(400, 400);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = avatarColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '60px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(name, canvas.width / 2, canvas.height / 2);
        return canvas.toDataURL('image/png');
    }
    createUser() {
        const username = this.createUsername();
        const avatarColor = this.genearateRandomColors();
        const user = {
            userName: username,
            email: this.createEmail(),
            password: 'Dummy$password2',
            confirmPassword: 'Dummy$password2',
            avatarColor,
            avatarImage: this.createAvatarImage(username[0].toUpperCase(), avatarColor),
        };
        return user;
    }
    seed(count) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.createUser();
            try {
                for (let i = 0; i < count; i++) {
                    const res = yield axios_1.default.post(`${config_1.config.SERVER_URL}/api/v1/signup`, user);
                    console.log(`User ${i + 1} with username of ${res.data.user.name} created`);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
new Seed().seed(10);
