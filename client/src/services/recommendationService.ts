import api from './api';
import { Recommendation } from '../types';

export const recommendationService = {
  getRecommendations: () => api.get<Recommendation[]>('/recommendations'),
  generateRecommendations: () => api.post<Recommendation[]>('/recommendations/generate', {}),
  updateStatus: (id: string, status: string) => api.put<Recommendation>(`/recommendations/${id}`, { status }),
};
