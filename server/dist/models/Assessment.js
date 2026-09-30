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
exports.Assessment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const assessmentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true },
    type: { type: String, enum: ['initial', 'practice', 'mastery'], required: true },
    questions: [{
            questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question', required: true },
            selectedAnswer: { type: Number, required: true },
            correct: { type: Boolean, required: true },
            timeTaken: { type: Number },
        }],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    topicResults: [{
            topicId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Topic', required: true },
            topicName: { type: String, required: true },
            correct: { type: Number, required: true },
            total: { type: Number, required: true },
            percentage: { type: Number, required: true },
        }],
    completedAt: { type: Date, default: Date.now },
});
exports.Assessment = mongoose_1.default.model('Assessment', assessmentSchema);
//# sourceMappingURL=Assessment.js.map