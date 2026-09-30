import mongoose, { Document } from 'mongoose';
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
export declare const Topic: mongoose.Model<ITopic, {}, {}, {}, mongoose.Document<unknown, {}, ITopic, {}, {}> & ITopic & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Topic.d.ts.map