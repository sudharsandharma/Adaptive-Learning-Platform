import mongoose, { Document } from 'mongoose';
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
export declare const LearningPath: mongoose.Model<ILearningPath, {}, {}, {}, mongoose.Document<unknown, {}, ILearningPath, {}, {}> & ILearningPath & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=LearningPath.d.ts.map