"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recommendation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const recommendationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    topicId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Topic', required: true },
    topicName: { type: String, required: true },
    subject: { type: String, required: true },
    reason: { type: String, required: true },
    resources: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Resource', required: true }],
    priority: { type: Number, required: true },
    difficulty: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'completed', 'skipped'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});
exports.Recommendation = mongoose_1.default.model('Recommendation', recommendationSchema);
//# sourceMappingURL=Recommendation.js.map