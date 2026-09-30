import { Question } from '../../models/Question';
import { Assessment } from '../../models/Assessment';
import { Progress } from '../../models/Progress';
import mongoose from 'mongoose';

export class AssessmentService {
  async generateAssessment(subject: string, topicIds?: string[], difficulty?: string, count: number = 10): Promise<any[]> {
    const query: any = { subject };
    if (topicIds && topicIds.length > 0) query.topic = { $in: topicIds };
    if (difficulty) query.difficulty = difficulty;
    
    return await Question.aggregate([
      { $match: query },
      { $sample: { size: count } }
    ]);
  }

  async gradeAssessment(assessmentId: string, answers: {questionId: string, selectedAnswer: number}[]): Promise<any> {
    const assessment = await Assessment.findById(assessmentId).populate('questions.questionId');
    if (!assessment) throw new Error('Assessment not found');

    let correct = 0;
    const gradedQuestions = [];

    for (const ans of answers) {
      const q = await Question.findById(ans.questionId);
      const isCorrect = q?.correctAnswer === ans.selectedAnswer;
      if (isCorrect) correct++;
      gradedQuestions.push({
        questionId: ans.questionId as unknown as mongoose.Types.ObjectId,
        selectedAnswer: ans.selectedAnswer,
        correct: isCorrect
      });
    }

    assessment.questions = gradedQuestions;
    assessment.score = (correct / answers.length) * 100;
    await assessment.save();
    return assessment;
  }

  async updateProgress(userId: string, assessmentResult: any): Promise<void> {
    for (const tr of assessmentResult.topicResults) {
      await Progress.findOneAndUpdate(
        { userId, topicId: tr.topicId },
        { 
          $set: { masteryScore: tr.percentage, status: tr.percentage >= 80 ? 'mastered' : tr.percentage >= 50 ? 'proficient' : 'in_progress' },
          $inc: { attempts: 1 },
          $push: { scores: tr.percentage },
          $currentDate: { lastAttemptDate: true }
        },
        { upsert: true }
      );
    }
  }

  async getTopicBreakdown(assessmentId: string): Promise<any[]> {
    const assessment = await Assessment.findById(assessmentId);
    return assessment?.topicResults || [];
  }
}

export const assessmentService = new AssessmentService();
