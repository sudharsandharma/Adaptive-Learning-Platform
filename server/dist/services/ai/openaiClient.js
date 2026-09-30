"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiClient = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("../../config");
exports.openaiClient = new openai_1.default({
    apiKey: config_1.config.openaiApiKey,
    baseURL: config_1.config.openaiBaseUrl !== 'https://api.openai.com/v1' ? config_1.config.openaiBaseUrl : undefined,
});
//# sourceMappingURL=openaiClient.js.map