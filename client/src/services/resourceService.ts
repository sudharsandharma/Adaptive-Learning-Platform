import api from './api';
import { Resource } from '../types';

export const resourceService = {
  getResources: (params?: any) => api.get<Resource[]>('/resources', { params }),
  getRecommendedResources: () => api.get<Resource[]>('/resources/recommended'),
  getResource: (id: string) => api.get<Resource>(`/resources/${id}`),
};
