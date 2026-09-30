import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  topicName: string;
  subject: string;
  masteryScore: number;
  status: 'not_started' | 'in_progress' | 'proficient' | 'mastered';
  attempts: number;
  lastAttemptDate?: Date;
  scores: number[];
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    topicName: { type: String, required: true },
    subject: { type: String, required: true },
    masteryScore: { type: Number, default: 0 },
    status: { type: String, enum: ['not_started', 'in_progress', 'proficient', 'mastered'], default: 'not_started' },
    attempts: { type: Number, default: 0 },
    lastAttemptDate: { type: Date },
    scores: [{ type: Number }],
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

export const Progress = mongoose.model<IProgress>('Progress', progressSchema);
