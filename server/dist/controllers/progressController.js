"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgressStats = exports.getTopicProgress = exports.getProgress = void 0;
const Progress_1 = require("../models/Progress");
const Assessment_1 = require("../models/Assessment");
const Topic_1 = require("../models/Topic");
const getProgress = async (req, res, next) => {
    try {
        const query = { userId: req.user._id };
        if (req.query.subject)
            query.subject = req.query.subject;
        const progress = await Progress_1.Progress.find(query).sort({ subject: 1, topicName: 1 });
        res.json({ success: true, data: progress });
    }
    catch (error) {
        next(error);
    }
};
exports.getProgress = getProgress;
const getTopicProgress = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const progress = await Progress_1.Progress.find({ userId }).sort({ subject: 1, topicName: 1 });
        // Group by subject
        const bySubject = {};
        for (const p of progress) {
            if (!bySubject[p.subject])
                bySubject[p.subject] = [];
            bySubject[p.subject].push({
                topicId: p.topicId,
                topicName: p.topicName,
                masteryScore: p.masteryScore,
                status: p.status,
                attempts: p.attempts,
                scores: p.scores,
            });
        }
        res.json({ success: true, data: bySubject });
    }
    catch (error) {
        next(error);
    }
};
exports.getTopicProgress = getTopicProgress;
const getProgressStats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const [allProgress, assessments, totalTopics] = await Promise.all([
            Progress_1.Progress.find({ userId }),
            Assessment_1.Assessment.find({ userId }).sort({ completedAt: -1 }).limit(20),
            Topic_1.Topic.countDocuments(),
        ]);
        // Calculate overall mastery
        const progressWithScores = allProgress.filter((p) => p.masteryScore > 0);
        const overallMastery = progressWithScores.length > 0
            ? Math.round(progressWithScores.reduce((sum, p) => sum + p.masteryScore, 0) / progressWithScores.length)
            : 0;
        // Topics mastered / in progress
        const topicsMastered = allProgress.filter((p) => p.status === 'mastered').length;
        const topicsInProgress = allProgress.filter((p) => p.status === 'in_progress' || p.status === 'proficient').length;
        // Strong and weak topics
        const strongTopics = allProgress
            .filter((p) => p.masteryScore >= 70)
            .sort((a, b) => b.masteryScore - a.masteryScore)
            .slice(0, 5)
            .map((p) => ({ topicName: p.topicName, score: p.masteryScore, subject: p.subject }));
        const weakTopics = allProgress
            .filter((p) => p.masteryScore > 0 && p.masteryScore < 70)
            .sort((a, b) => a.masteryScore - b.masteryScore)
            .slice(0, 5)
            .map((p) => ({ topicName: p.topicName, score: p.masteryScore, subject: p.subject }));
        // Recent scores from assessments
        const recentScores = assessments.map((a) => ({
            date: a.completedAt.toISOString(),
            score: a.score,
            subject: a.subject,
        }));
        // Subject progress
        const subjectMap = new Map();
        for (const p of progressWithScores) {
            const existing = subjectMap.get(p.subject) || { total: 0, sum: 0 };
            existing.total++;
            existing.sum += p.masteryScore;
            subjectMap.set(p.subject, existing);
        }
        const subjectProgress = Array.from(subjectMap.entries()).map(([subject, data]) => ({
            subject,
            mastery: Math.round(data.sum / data.total),
        }));
        // Calculate streak (consecutive days with assessments)
        let currentStreak = 0;
        if (assessments.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dates = [...new Set(assessments.map((a) => {
                    const d = new Date(a.completedAt);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime();
                }))].sort((a, b) => b - a);
            for (let i = 0; i < dates.length; i++) {
                const expectedDate = new Date(today);
                expectedDate.setDate(expectedDate.getDate() - i);
                expectedDate.setHours(0, 0, 0, 0);
                if (dates[i] === expectedDate.getTime()) {
                    currentStreak++;
                }
                else {
                    break;
                }
            }
        }
        res.json({
            success: true,
            data: {
                overallMastery,
                topicsMastered,
                topicsInProgress,
                totalTopics,
                currentStreak,
                strongTopics,
                weakTopics,
                recentScores,
                subjectProgress,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProgressStats = getProgressStats;
//# sourceMappingURL=progressController.js.map