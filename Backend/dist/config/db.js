"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || '';
const connectDB = async () => {
    if (!MONGO_URI) {
        console.error(' MongoDB URI not found in environment variables');
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // optional: timeout for faster errors
        });
        console.log(' MongoDB Atlas connected successfully');
    }
    catch (error) {
        console.error(' MongoDB Atlas connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
