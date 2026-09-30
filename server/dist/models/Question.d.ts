import mongoose, { Document } from 'mongoose';
export interface IQuestion extends Document {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    subject: string;
    topic: mongoose.Types.ObjectId;
    topicName: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}
export declare const Question: mongoose.Model<IQuestion, {}, {}, {}, mongoose.Document<unknown, {}, IQuestion, {}, {}> & IQuestion & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Question.d.ts.map