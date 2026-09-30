import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  subject: string;
  topic: mongoose.Types.ObjectId;
  topicName: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'video' | 'article' | 'interactive' | 'practice' | 'pdf';
  url: string;
  estimatedMinutes: number;
  bandwidth: 'low' | 'medium' | 'high';
  accessibilityFeatures: string[];
}

const resourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  topicName: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  type: { type: String, enum: ['video', 'article', 'interactive', 'practice', 'pdf'], required: true },
  url: { type: String, required: true },
  estimatedMinutes: { type: Number, required: true },
  bandwidth: { type: String, enum: ['low', 'medium', 'high'], required: true },
  accessibilityFeatures: [{ type: String }],
});

export const Resource = mongoose.model<IResource>('Resource', resourceSchema);
