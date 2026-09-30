import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  name: string;
  slug: string;
  subject: string;
  description: string;
  prerequisites: mongoose.Types.ObjectId[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  order: number;
  resources: mongoose.Types.ObjectId[];
}

const topicSchema = new Schema<ITopic>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  estimatedHours: { type: Number, default: 1 },
  order: { type: Number, required: true },
  resources: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
});

export const Topic = mongoose.model<ITopic>('Topic', topicSchema);
