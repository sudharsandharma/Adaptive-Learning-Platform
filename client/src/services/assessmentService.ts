import api from './api';
import { Assessment, Question } from '../types';

export const assessmentService = {
  getAssessments: () => api.get<Assessment[]>('/assessments'),
  getAssessment: (id: string) => api.get<Assessment>(`/assessments/${id}`),
  createInitialAssessment: (subject: string, topicIds?: string[]) =>
    api.post<{ assessment: Assessment; assessmentId: string; questions: Question[] }>('/assessments/start', {
      subject,
      topicIds,
      type: 'initial',
    }),
  createPracticeAssessment: (subject: string, topicIds?: string[]) =>
    api.post<{ assessment: Assessment; assessmentId: string; questions: Question[] }>('/assessments/start', {
      subject,
      topicIds,
      type: 'practice',
    }),
  submitAssessment: (id: string, answers: { questionId: string; selectedAnswer: number; timeTaken?: number }[]) =>
    api.post<Assessment>(`/assessments/${id}/submit`, { answers }),
};
