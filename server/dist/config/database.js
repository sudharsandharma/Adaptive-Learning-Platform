"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./index");
let cachedPromise = null;
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1) {
        return mongoose_1.default.connection;
    }
    if (cachedPromise) {
        await cachedPromise;
        return mongoose_1.default.connection;
    }
    try {
        cachedPromise = mongoose_1.default.connect(index_1.config.mongodbUri);
        const conn = await cachedPromise;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn.connection;
    }
    catch (error) {
        cachedPromise = null;
        console.error(`Error connecting to MongoDB: ${error}`);
        if (process.env.VERCEL !== '1' && !process.env.NOW_REGION) {
            process.exit(1);
        }
        throw error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map