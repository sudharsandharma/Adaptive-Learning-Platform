import api from './api';
import { User } from '../types';

export const authService = {
  register: (data: any) => api.post<{ token: string; user: User }>('/auth/register', data),
  login: (data: any) => api.post<{ token: string; user: User }>('/auth/login', data),
  getMe: () => api.get<User>('/auth/me'),
  updateProfile: (data: Partial<User>) => api.post<User>('/student/onboarding', data),
  saveProfile: (data: Partial<User>) => api.put<User>('/student/profile', data),
};
