import api from './api';
import { LearningPath } from '../types';

export const learningPathService = {
  getLearningPaths: () => api.get<LearningPath[]>('/learning-path'),
  getLearningPath: (subject: string) =>
    api.get<LearningPath[]>('/learning-path', { params: { subject } }).then((res: any) => ({
      ...res,
      data: Array.isArray(res.data) ? res.data[0] || null : res.data,
    })),
  generateLearningPath: (subject: string) => api.post<LearningPath>('/learning-path/generate', { subject }),
  updateNodeStatus: (pathId: string, topicId: string, status: string) =>
    api.put<LearningPath>(`/learning-path/${pathId}`, { topicId, status }),
};
