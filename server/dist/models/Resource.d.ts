import mongoose, { Document } from 'mongoose';
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
export declare const Resource: mongoose.Model<IResource, {}, {}, {}, mongoose.Document<unknown, {}, IResource, {}, {}> & IResource & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Resource.d.ts.map