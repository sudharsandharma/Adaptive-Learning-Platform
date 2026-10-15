"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 5000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nomad',
    jwtSecret: process.env.JWT_SECRET || 'nomad-edu-super-secret-jwt-key-2026',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    openaiApiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
    openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    nodeEnv: process.env.NODE_ENV || 'development'
};
//# sourceMappingURL=index.js.map