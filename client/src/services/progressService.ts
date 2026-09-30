import api from './api';
import { Progress, ProgressStats } from '../types';

export const progressService = {
  getAllProgress: () => api.get<Progress[]>('/progress'),
  getProgressBySubject: (subject: string) => api.get<Progress[]>('/progress', { params: { subject } }),
  getTopicProgress: () => api.get('/progress/topics'),
  getStats: () => api.get<ProgressStats>('/progress/stats'),
};
