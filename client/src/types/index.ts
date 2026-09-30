export interface User {
  _id: string;
  name: string;
  email: string;
  educationLevel: string;
  grade?: string;
  age?: number;
  interests: string[];
  preferences: {
    resourceTypes: string[];
    studyTimePerDay: number;
    difficultyProgression: 'slow' | 'moderate' | 'fast';
    learningStyle: string;
  };
  goals: string[];
  onboardingCompleted: boolean;
  isDemo: boolean;
}

export interface Topic {
  _id: string;
  name: string;
  slug: string;
  subject: string;
  description: string;
  prerequisites: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  order: number;
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
  subject: string;
  topic: string;
  topicName: string;
  difficulty: string;
}

export interface Assessment {
  _id: string;
  userId: string;
  subject: string;
  type: 'initial' | 'practice' | 'mastery';
  questions: {
    questionId: string;
    selectedAnswer: number;
    correct: boolean;
    timeTaken?: number;
  }[];
  score: number;
  totalQuestions: number;
  topicResults: TopicResult[];
  completedAt: string;
}

export interface TopicResult {
  topicId: string;
  topicName: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface Resource {
  _id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  topicName: string;
  difficulty: string;
  type: 'video' | 'article' | 'interactive' | 'practice' | 'pdf';
  url: string;
  estimatedMinutes: number;
  bandwidth: 'low' | 'medium' | 'high';
  accessibilityFeatures: string[];
}

export interface Progress {
  _id: string;
  userId: string;
  topicId: string;
  topicName: string;
  subject: string;
  masteryScore: number;
  status: 'not_started' | 'in_progress' | 'proficient' | 'mastered';
  attempts: number;
  lastAttemptDate?: string;
  scores: number[];
}

export interface LearningPathNode {
  topicId: string;
  topicName: string;
  status: 'completed' | 'current' | 'locked' | 'available';
  difficulty: string;
  estimatedTime: string;
  score?: number;
  reason?: string;
  order: number;
}

export interface LearningPath {
  _id: string;
  userId: string;
  subject: string;
  nodes: LearningPathNode[];
  currentNodeIndex: number;
  generatedAt: string;
  updatedAt: string;
}

export interface Recommendation {
  _id: string;
  userId: string;
  topicId: string;
  topicName: string;
  subject: string;
  reason: string;
  resources: Resource[];
  priority: number;
  difficulty: string;
  status: 'pending' | 'accepted' | 'completed' | 'skipped';
  createdAt: string;
}

export interface ProgressStats {
  overallMastery: number;
  topicsMastered: number;
  topicsInProgress: number;
  totalTopics: number;
  currentStreak: number;
  strongTopics: { topicName: string; score: number }[];
  weakTopics: { topicName: string; score: number }[];
  recentScores: { date: string; score: number; subject: string }[];
  subjectProgress: { subject: string; mastery: number }[];
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}
