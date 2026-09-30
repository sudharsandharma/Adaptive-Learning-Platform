import api from './api';
import { Topic } from '../types';

export const topicService = {
  getTopics: (subject?: string) => api.get<Topic[]>('/topics', { params: { subject } }),
  getTopic: (id: string) => api.get<Topic>(`/topics/${id}`),
};
