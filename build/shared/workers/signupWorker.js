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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupWorker = void 0;
const singupQueue_1 = require("../services/queue/singupQueue");
const userModel_1 = require("../../features/users/models/userModel");
class SignupWorker {
    constructor() {
        this.signupQueue = new singupQueue_1.SignupQueue('signupQueue');
        this.signupQueue.processQueue(this.createUser);
    }
    saveToDb(data) {
        this.signupQueue.addToQueue(data);
    }
    createUser(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = job.data;
            yield userModel_1.userModel.create(data);
        });
    }
}
exports.SignupWorker = SignupWorker;
