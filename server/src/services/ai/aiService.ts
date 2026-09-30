import { openaiClient } from './openaiClient';
import { config } from '../../config';

export class AIService {
  private isConfigured(): boolean {
    return Boolean(
      config.openaiApiKey &&
      config.openaiApiKey !== 'your-openai-api-key' &&
      config.openaiApiKey.trim().length > 10
    );
  }

  private async getResponse(prompt: string, requireJson = true) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured — using deterministic fallback');
    }

    const response = await openaiClient.chat.completions.create({
      model: config.openaiModel,
      messages: [{ role: 'system', content: prompt }],
      response_format: requireJson ? { type: 'json_object' } : undefined,
    });
    const content = response.choices[0]?.message?.content;
    return requireJson ? JSON.parse(content || '{}') : content;
  }

  async generateLearningInsight(studentContext: any): Promise<string> {
    const prompt = `You are an adaptive learning advisor for NOMAD EDU. Based on the student context: ${JSON.stringify(studentContext)}, generate a short, specific, encouraging learning insight string (max 2 sentences) referencing their actual topic scores.`;
    return (await this.getResponse(prompt, false)) as string;
  }

  async answerStudentQuestion(question: string, studentContext: any): Promise<string> {
    const prompt = `You are an adaptive AI tutor for NOMAD EDU. Student Context: ${JSON.stringify(studentContext)}. Question: ${question}. Answer clearly and concisely using the student's actual topic performance, weak topics, and learning path.`;
    return (await this.getResponse(prompt, false)) as string;
  }

  async generateLearningPath(studentContext: any): Promise<any> {
    const prompt = `Generate a recommended topic order based on student context: ${JSON.stringify(studentContext)}. Return JSON: { "recommendedOrder": ["topicId1", "topicId2"] }`;
    return await this.getResponse(prompt, true);
  }

  async generateRecommendations(studentContext: any): Promise<any> {
    const prompt = `Generate topic recommendations based on student context: ${JSON.stringify(studentContext)}. Return JSON: { "recommendations": [{ "topicId": "id", "reason": "reason" }] }`;
    return await this.getResponse(prompt, true);
  }
}

export const aiService = new AIService();
