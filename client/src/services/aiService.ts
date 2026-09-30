import api from './api';

export const aiService = {
  sendMessage: (message: string, context?: any) =>
    api.post<{ message: string; reply: string }>('/ai/assistant', { message, context }),
  getLearningInsight: () => api.post<{ insight: string }>('/ai/learning-insight', {}),
};
