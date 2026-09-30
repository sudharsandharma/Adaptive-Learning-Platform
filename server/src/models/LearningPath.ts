import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningPath extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  nodes: {
    topicId: mongoose.Types.ObjectId;
    topicName: string;
    status: 'completed' | 'current' | 'locked' | 'available';
    difficulty: string;
    estimatedTime: string;
    score?: number;
    reason?: string;
    order: number;
  }[];
  currentNodeIndex: number;
  generatedAt: Date;
  updatedAt: Date;
}

const learningPathSchema = new Schema<ILearningPath>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    nodes: [{
      topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
      topicName: { type: String, required: true },
      status: { type: String, enum: ['completed', 'current', 'locked', 'available'], required: true },
      difficulty: { type: String, required: true },
      estimatedTime: { type: String, required: true },
      score: { type: Number },
      reason: { type: String },
      order: { type: Number, required: true },
    }],
    currentNodeIndex: { type: Number, default: 0 },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LearningPath = mongoose.model<ILearningPath>('LearningPath', learningPathSchema);
