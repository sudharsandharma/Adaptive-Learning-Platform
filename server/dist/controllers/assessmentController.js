"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitAssessment = exports.startAssessment = exports.getAssessment = exports.getAssessments = void 0;
const Assessment_1 = require("../models/Assessment");
const Question_1 = require("../models/Question");
const Progress_1 = require("../models/Progress");
const LearningPath_1 = require("../models/LearningPath");
const mongoose_1 = __importDefault(require("mongoose"));
const getAssessments = async (req, res, next) => {
    try {
        const assessments = await Assessment_1.Assessment.find({ userId: req.user._id })
            .sort({ completedAt: -1 })
            .select('-questions');
        res.json({ success: true, data: assessments });
    }
    catch (error) {
        next(error);
    }
};
exports.getAssessments = getAssessments;
const getAssessment = async (req, res, next) => {
    try {
        const assessment = await Assessment_1.Assessment.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('questions.questionId');
        if (!assessment) {
            res.status(404).json({ success: false, error: 'Assessment not found' });
            return;
        }
        const assessmentObj = assessment.toObject();
        const mappedQuestions = (assessmentObj.questions || []).map((q) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getAssessment = getAssessment;
const startAssessment = async (req, res, next) => {
    try {
        const { subject, topicIds, difficulty, type = 'practice', count = 6 } = req.body;
        if (!subject) {
            res.status(400).json({ success: false, error: 'Subject is required' });
            return;
        }
        const query = { subject };
        if (topicIds && topicIds.length > 0) {
            query.topic = { $in: topicIds.map((id) => new mongoose_1.default.Types.ObjectId(id)) };
        }
        if (difficulty)
            query.difficulty = difficulty;
        const questions = await Question_1.Question.aggregate([
            { $match: query },
            { $sample: { size: count } },
        ]);
        if (questions.length === 0) {
            res.status(404).json({ success: false, error: 'No questions found for this subject' });
            return;
        }
        const assessment = await Assessment_1.Assessment.create({
            userId: req.user._id,
            subject,
            type,
            questions: questions.map((q) => ({
                questionId: q._id,
                selectedAnswer: -1,
                correct: false,
            })),
            score: 0,
            totalQuestions: questions.length,
            topicResults: [],
        });
        const safeQuestions = questions.map((q) => ({
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
    }
    catch (error) {
        next(error);
    }
};
exports.startAssessment = startAssessment;
const submitAssessment = async (req, res, next) => {
    try {
        const { answers } = req.body;
        const assessment = await Assessment_1.Assessment.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!assessment) {
            res.status(404).json({ success: false, error: 'Assessment not found' });
            return;
        }
        const questionIds = answers.map((a) => a.questionId);
        const questions = await Question_1.Question.find({ _id: { $in: questionIds } });
        const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));
        let totalCorrect = 0;
        const topicScores = new Map();
        const gradedQuestions = answers.map((ans) => {
            const question = questionMap.get(ans.questionId);
            const isCorrect = question ? question.correctAnswer === ans.selectedAnswer : false;
            if (isCorrect)
                totalCorrect++;
            if (question) {
                const topicKey = question.topic.toString();
                const existing = topicScores.get(topicKey) || {
                    topicId: topicKey,
                    topicName: question.topicName,
                    correct: 0,
                    total: 0,
                };
                existing.total++;
                if (isCorrect)
                    existing.correct++;
                topicScores.set(topicKey, existing);
            }
            return {
                questionId: new mongoose_1.default.Types.ObjectId(ans.questionId),
                selectedAnswer: ans.selectedAnswer,
                correct: isCorrect,
                timeTaken: ans.timeTaken,
            };
        });
        const score = answers.length > 0 ? Math.round((totalCorrect / answers.length) * 100) : 0;
        const topicResults = Array.from(topicScores.values()).map((ts) => ({
            topicId: new mongoose_1.default.Types.ObjectId(ts.topicId),
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
            const status = tr.percentage >= 80 ? 'mastered' : tr.percentage >= 60 ? 'proficient' : 'in_progress';
            await Progress_1.Progress.findOneAndUpdate({ userId: req.user._id, topicId: tr.topicId }, {
                $set: {
                    masteryScore: tr.percentage,
                    status,
                    topicName: tr.topicName,
                    subject: assessment.subject,
                    lastAttemptDate: new Date(),
                },
                $inc: { attempts: 1 },
                $push: { scores: tr.percentage },
            }, { upsert: true, new: true });
        }
        // Update learning path if exists
        const learningPaths = await LearningPath_1.LearningPath.find({ userId: req.user._id, subject: assessment.subject });
        for (const lp of learningPaths) {
            for (const node of lp.nodes) {
                const topicResult = topicResults.find((tr) => tr.topicId.toString() === node.topicId.toString());
                if (topicResult) {
                    node.score = topicResult.percentage;
                    if (topicResult.percentage >= 80) {
                        node.status = 'completed';
                        node.reason = `Mastered with ${topicResult.percentage}% score!`;
                    }
                    else if (topicResult.percentage >= 50) {
                        node.status = 'current';
                        node.reason = `Scored ${topicResult.percentage}%. A little more practice to reach mastery (80%).`;
                    }
                    else {
                        node.status = 'current';
                        node.reason = `Scored ${topicResult.percentage}%. Review foundational resources and try again.`;
                    }
                }
            }
            // Ensure proper progression of current/available/locked nodes
            let foundCurrent = false;
            for (let i = 0; i < lp.nodes.length; i++) {
                if (lp.nodes[i].status === 'completed')
                    continue;
                if (!foundCurrent) {
                    lp.nodes[i].status = 'current';
                    lp.currentNodeIndex = i;
                    foundCurrent = true;
                }
                else if (i > 0 && lp.nodes[i - 1].status === 'completed') {
                    lp.nodes[i].status = 'available';
                }
            }
            lp.updatedAt = new Date();
            await lp.save();
        }
        const questionsWithExplanations = answers.map((ans) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.submitAssessment = submitAssessment;
//# sourceMappingURL=assessmentController.js.map