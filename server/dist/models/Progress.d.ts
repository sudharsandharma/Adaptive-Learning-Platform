import mongoose, { Document } from 'mongoose';
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
export declare const Progress: mongoose.Model<IProgress, {}, {}, {}, mongoose.Document<unknown, {}, IProgress, {}, {}> & IProgress & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Progress.d.ts.map