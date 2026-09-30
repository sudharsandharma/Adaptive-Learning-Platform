import mongoose, { Document } from 'mongoose';
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
export declare const Recommendation: mongoose.Model<IRecommendation, {}, {}, {}, mongoose.Document<unknown, {}, IRecommendation, {}, {}> & IRecommendation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Recommendation.d.ts.map