import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Assessment } from '../models/Assessment';
import { Question } from '../models/Question';
import { Progress } from '../models/Progress';
import { LearningPath } from '../models/LearningPath';
import mongoose from 'mongoose';

export const getAssessments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assessments = await Assessment.find({ userId: req.user!._id })
      .sort({ completedAt: -1 })
      .select('-questions');
    res.json({ success: true, data: assessments });
  } catch (error) {
    next(error);
  }
};

export const getAssessment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    }).populate('questions.questionId');

    if (!assessment) {
      res.status(404).json({ success: false, error: 'Assessment not found' });
      return;
    }

    const assessmentObj = assessment.toObject();
    const mappedQuestions = (assessmentObj.questions || []).map((q: any) => {
      const qDoc = q.questionId;
      if (qDoc && typeof qDoc === 'object' && qDoc.question) {
        return {
          _id: qDoc._id,
          questionId: qDoc._id,
          question: qDoc.question,
          options: qDoc.options,
          correctAnswer: qDoc.correctAnswer,
          explanation: qDoc.explanation,
          subject: qDoc.subject,
          topic: qDoc.topic,
          topicName: qDoc.topicName,
          difficulty: qDoc.difficulty,
          selectedAnswer: q.selectedAnswer,
          correct: q.correct,
          timeTaken: q.timeTaken,
        };
      }
      return q;
    });

    res.json({
      success: true,
      data: {
        ...assessmentObj,
        questions: mappedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const startAssessment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { subject, topicIds, difficulty, type = 'practice', count = 6 } = req.body;

    if (!subject) {
      res.status(400).json({ success: false, error: 'Subject is required' });
      return;
    }

    const query: any = { subject };
    if (topicIds && topicIds.length > 0) {
      query.topic = { $in: topicIds.map((id: string) => new mongoose.Types.ObjectId(id)) };
    }
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: count } },
    ]);

    if (questions.length === 0) {
      res.status(404).json({ success: false, error: 'No questions found for this subject' });
      return;
    }

    const assessment = await Assessment.create({
      userId: req.user!._id,
      subject,
      type,
      questions: questions.map((q: any) => ({
        questionId: q._id,
        selectedAnswer: -1,
        correct: false,
      })),
      score: 0,
      totalQuestions: questions.length,
      topicResults: [],
    });

    const safeQuestions = questions.map((q: any) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      subject: q.subject,
      topic: q.topic,
      topicName: q.topicName,
      difficulty: q.difficulty,
    }));

    res.json({
      success: true,
      data: {
        assessmentId: assessment._id,
        assessment: {
          ...assessment.toObject(),
          questions: safeQuestions,
        },
        subject,
        type,
        questions: safeQuestions,
        totalQuestions: safeQuestions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitAssessment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { answers } = req.body;

    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!assessment) {
      res.status(404).json({ success: false, error: 'Assessment not found' });
      return;
    }

    const questionIds = answers.map((a: any) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let totalCorrect = 0;
    const topicScores: Map<string, { topicId: string; topicName: string; correct: number; total: number }> = new Map();

    const gradedQuestions = answers.map((ans: any) => {
      const question = questionMap.get(ans.questionId);
      const isCorrect = question ? question.correctAnswer === ans.selectedAnswer : false;
      if (isCorrect) totalCorrect++;

      if (question) {
        const topicKey = question.topic.toString();
        const existing = topicScores.get(topicKey) || {
          topicId: topicKey,
          topicName: question.topicName,
          correct: 0,
          total: 0,
        };
        existing.total++;
        if (isCorrect) existing.correct++;
        topicScores.set(topicKey, existing);
      }

      return {
        questionId: new mongoose.Types.ObjectId(ans.questionId),
        selectedAnswer: ans.selectedAnswer,
        correct: isCorrect,
        timeTaken: ans.timeTaken,
      };
    });

    const score = answers.length > 0 ? Math.round((totalCorrect / answers.length) * 100) : 0;

    const topicResults = Array.from(topicScores.values()).map((ts) => ({
      topicId: new mongoose.Types.ObjectId(ts.topicId),
      topicName: ts.topicName,
      correct: ts.correct,
      total: ts.total,
      percentage: ts.total > 0 ? Math.round((ts.correct / ts.total) * 100) : 0,
    }));

    assessment.questions = gradedQuestions;
    assessment.score = score;
    assessment.totalQuestions = answers.length;
    assessment.topicResults = topicResults;
    assessment.completedAt = new Date();
    await assessment.save();

    // Update progress for each topic
    for (const tr of topicResults) {
      const status =
        tr.percentage >= 80 ? 'mastered' : tr.percentage >= 60 ? 'proficient' : 'in_progress';

      await Progress.findOneAndUpdate(
        { userId: req.user!._id, topicId: tr.topicId },
        {
          $set: {
            masteryScore: tr.percentage,
            status,
            topicName: tr.topicName,
            subject: assessment.subject,
            lastAttemptDate: new Date(),
          },
          $inc: { attempts: 1 },
          $push: { scores: tr.percentage },
        },
        { upsert: true, new: true }
      );
    }

    // Update learning path if exists
    const learningPaths = await LearningPath.find({ userId: req.user!._id, subject: assessment.subject });
    for (const lp of learningPaths) {
      for (const node of lp.nodes) {
        const topicResult = topicResults.find((tr) => tr.topicId.toString() === node.topicId.toString());
        if (topicResult) {
          node.score = topicResult.percentage;
          if (topicResult.percentage >= 80) {
            node.status = 'completed';
            node.reason = `Mastered with ${topicResult.percentage}% score!`;
          } else if (topicResult.percentage >= 50) {
            node.status = 'current';
            node.reason = `Scored ${topicResult.percentage}%. A little more practice to reach mastery (80%).`;
          } else {
            node.status = 'current';
            node.reason = `Scored ${topicResult.percentage}%. Review foundational resources and try again.`;
          }
        }
      }

      // Ensure proper progression of current/available/locked nodes
      let foundCurrent = false;
      for (let i = 0; i < lp.nodes.length; i++) {
        if (lp.nodes[i].status === 'completed') continue;
        if (!foundCurrent) {
          lp.nodes[i].status = 'current';
          lp.currentNodeIndex = i;
          foundCurrent = true;
        } else if (i > 0 && lp.nodes[i - 1].status === 'completed') {
          lp.nodes[i].status = 'available';
        }
      }
      lp.updatedAt = new Date();
      await lp.save();
    }

    const questionsWithExplanations = answers.map((ans: any) => {
      const question = questionMap.get(ans.questionId);
      return {
        questionId: ans.questionId,
        question: question?.question,
        options: question?.options,
        selectedAnswer: ans.selectedAnswer,
        correctAnswer: question?.correctAnswer,
        correct: question?.correctAnswer === ans.selectedAnswer,
        explanation: question?.explanation,
        topicName: question?.topicName,
        difficulty: question?.difficulty,
      };
    });

    res.json({
      success: true,
      data: {
        _id: assessment._id,
        assessmentId: assessment._id,
        subject: assessment.subject,
        type: assessment.type,
        score,
        totalQuestions: answers.length,
        correctAnswers: totalCorrect,
        topicResults,
        questions: questionsWithExplanations,
        recommendations: topicResults
          .filter((tr) => tr.percentage < 70)
          .map((tr) => `Review ${tr.topicName} — scored ${tr.percentage}%`),
      },
    });
  } catch (error) {
    next(error);
  }
};
