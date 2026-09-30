import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  type: 'initial' | 'practice' | 'mastery';
  questions: {
    questionId: mongoose.Types.ObjectId;
    selectedAnswer: number;
    correct: boolean;
    timeTaken?: number;
  }[];
  score: number;
  totalQuestions: number;
  topicResults: {
    topicId: mongoose.Types.ObjectId;
    topicName: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  completedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true },
  type: { type: String, enum: ['initial', 'practice', 'mastery'], required: true },
  questions: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedAnswer: { type: Number, required: true },
    correct: { type: Boolean, required: true },
    timeTaken: { type: Number },
  }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  topicResults: [{
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    topicName: { type: String, required: true },
    correct: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
  }],
  completedAt: { type: Date, default: Date.now },
});

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
