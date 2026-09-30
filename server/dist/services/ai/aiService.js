"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = void 0;
const openaiClient_1 = require("./openaiClient");
const config_1 = require("../../config");
class AIService {
    isConfigured() {
        return Boolean(config_1.config.openaiApiKey &&
            config_1.config.openaiApiKey !== 'your-openai-api-key' &&
            config_1.config.openaiApiKey.trim().length > 10);
    }
    async getResponse(prompt, requireJson = true) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI API key not configured — using deterministic fallback');
        }
        const response = await openaiClient_1.openaiClient.chat.completions.create({
            model: config_1.config.openaiModel,
            messages: [{ role: 'system', content: prompt }],
            response_format: requireJson ? { type: 'json_object' } : undefined,
        });
        const content = response.choices[0]?.message?.content;
        return requireJson ? JSON.parse(content || '{}') : content;
    }
    async generateLearningInsight(studentContext) {
        const prompt = `You are an adaptive learning advisor for NOMAD EDU. Based on the student context: ${JSON.stringify(studentContext)}, generate a short, specific, encouraging learning insight string (max 2 sentences) referencing their actual topic scores.`;
        return (await this.getResponse(prompt, false));
    }
    async answerStudentQuestion(question, studentContext) {
        const prompt = `You are an adaptive AI tutor for NOMAD EDU. Student Context: ${JSON.stringify(studentContext)}. Question: ${question}. Answer clearly and concisely using the student's actual topic performance, weak topics, and learning path.`;
        return (await this.getResponse(prompt, false));
    }
    async generateLearningPath(studentContext) {
        const prompt = `Generate a recommended topic order based on student context: ${JSON.stringify(studentContext)}. Return JSON: { "recommendedOrder": ["topicId1", "topicId2"] }`;
        return await this.getResponse(prompt, true);
    }
    async generateRecommendations(studentContext) {
        const prompt = `Generate topic recommendations based on student context: ${JSON.stringify(studentContext)}. Return JSON: { "recommendations": [{ "topicId": "id", "reason": "reason" }] }`;
        return await this.getResponse(prompt, true);
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
//# sourceMappingURL=aiService.js.map