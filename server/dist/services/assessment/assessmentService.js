"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentService = exports.AssessmentService = void 0;
const Question_1 = require("../../models/Question");
const Assessment_1 = require("../../models/Assessment");
const Progress_1 = require("../../models/Progress");
class AssessmentService {
    async generateAssessment(subject, topicIds, difficulty, count = 10) {
        const query = { subject };
        if (topicIds && topicIds.length > 0)
            query.topic = { $in: topicIds };
        if (difficulty)
            query.difficulty = difficulty;
        return await Question_1.Question.aggregate([
            { $match: query },
            { $sample: { size: count } }
        ]);
    }
    async gradeAssessment(assessmentId, answers) {
        const assessment = await Assessment_1.Assessment.findById(assessmentId).populate('questions.questionId');
        if (!assessment)
            throw new Error('Assessment not found');
        let correct = 0;
        const gradedQuestions = [];
        for (const ans of answers) {
            const q = await Question_1.Question.findById(ans.questionId);
            const isCorrect = q?.correctAnswer === ans.selectedAnswer;
            if (isCorrect)
                correct++;
            gradedQuestions.push({
                questionId: ans.questionId,
                selectedAnswer: ans.selectedAnswer,
                correct: isCorrect
            });
        }
        assessment.questions = gradedQuestions;
        assessment.score = (correct / answers.length) * 100;
        await assessment.save();
        return assessment;
    }
    async updateProgress(userId, assessmentResult) {
        for (const tr of assessmentResult.topicResults) {
            await Progress_1.Progress.findOneAndUpdate({ userId, topicId: tr.topicId }, {
                $set: { masteryScore: tr.percentage, status: tr.percentage >= 80 ? 'mastered' : tr.percentage >= 50 ? 'proficient' : 'in_progress' },
                $inc: { attempts: 1 },
                $push: { scores: tr.percentage },
                $currentDate: { lastAttemptDate: true }
            }, { upsert: true });
        }
    }
    async getTopicBreakdown(assessmentId) {
        const assessment = await Assessment_1.Assessment.findById(assessmentId);
        return assessment?.topicResults || [];
    }
}
exports.AssessmentService = AssessmentService;
exports.assessmentService = new AssessmentService();
//# sourceMappingURL=assessmentService.js.map