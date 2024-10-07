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
exports.cloudinaryUploader = void 0;
const cloudinary_1 = require("cloudinary");
class Cloudinary {
    imageUpload(file, publicId, overWrite, invalidate) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                public_id: publicId,
                overwrite: overWrite,
                invalidate,
            };
            try {
                const result = yield cloudinary_1.v2.uploader.upload(file, options);
                return result;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    videoUpload(file, publicId, overWrite, invalidate) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                public_id: publicId,
                overwrite: overWrite,
                invalidate,
                resource_type: 'video',
                chunk_size: 50000,
            };
            try {
                const result = yield cloudinary_1.v2.uploader.upload(file, options);
                return result;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.cloudinaryUploader = new Cloudinary();
