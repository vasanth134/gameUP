"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// src/middlewares/uploadMiddleware.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Set up storage config
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // save in root/uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
// File filter for allowed types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|ppt|pptx|mp4|mp3|wav/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    if (extname)
        return cb(null, true);
    cb(new Error('File type not supported!'));
};
// Create upload middleware
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});
