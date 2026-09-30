import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  topicName: string;
  subject: string;
  reason: string;
  resources: mongoose.Types.ObjectId[];
  priority: number;
  difficulty: string;
  status: 'pending' | 'accepted' | 'completed' | 'skipped';
  createdAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  topicName: { type: String, required: true },
  subject: { type: String, required: true },
  reason: { type: String, required: true },
  resources: [{ type: Schema.Types.ObjectId, ref: 'Resource', required: true }],
  priority: { type: Number, required: true },
  difficulty: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'skipped'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', recommendationSchema);
