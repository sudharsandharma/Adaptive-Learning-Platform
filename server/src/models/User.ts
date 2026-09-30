import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  educationLevel: string;
  grade?: string;
  age?: number;
  interests: string[];
  preferences: {
    resourceTypes: string[];
    studyTimePerDay: number; // minutes
    difficultyProgression: 'slow' | 'moderate' | 'fast';
    learningStyle: string;
  };
  goals: string[];
  onboardingCompleted: boolean;
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    educationLevel: { type: String, default: '' },
    grade: { type: String },
    age: { type: Number },
    interests: [{ type: String }],
    preferences: {
      resourceTypes: [{ type: String }],
      studyTimePerDay: { type: Number, default: 60 },
      difficultyProgression: { type: String, enum: ['slow', 'moderate', 'fast'], default: 'moderate' },
      learningStyle: { type: String, default: 'visual' },
    },
    goals: [{ type: String }],
    onboardingCompleted: { type: Boolean, default: false },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', userSchema);
