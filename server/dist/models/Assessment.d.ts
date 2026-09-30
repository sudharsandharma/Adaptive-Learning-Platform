import mongoose, { Document } from 'mongoose';
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
export declare const Assessment: mongoose.Model<IAssessment, {}, {}, {}, mongoose.Document<unknown, {}, IAssessment, {}, {}> & IAssessment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Assessment.d.ts.map