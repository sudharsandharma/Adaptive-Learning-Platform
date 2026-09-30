"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecommendation = exports.generateRecommendations = exports.getRecommendations = void 0;
const Recommendation_1 = require("../models/Recommendation");
const Progress_1 = require("../models/Progress");
const Topic_1 = require("../models/Topic");
const Resource_1 = require("../models/Resource");
const User_1 = require("../models/User");
const getRecommendations = async (req, res, next) => {
    try {
        const recommendations = await Recommendation_1.Recommendation.find({
            userId: req.user._id,
            status: { $in: ['pending', 'accepted'] },
        })
            .sort({ priority: 1, createdAt: -1 })
            .populate('resources');
        res.json({ success: true, data: recommendations });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecommendations = getRecommendations;
const generateRecommendations = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User_1.User.findById(userId);
        // Clear old pending recommendations
        await Recommendation_1.Recommendation.deleteMany({ userId, status: 'pending' });
        // Get progress data
        const allProgress = await Progress_1.Progress.find({ userId });
        const subjects = user?.interests || [];
        const recommendations = [];
        let priority = 1;
        // 1. Recommend weak topics (below 70%)
        const weakTopics = allProgress
            .filter((p) => p.masteryScore > 0 && p.masteryScore < 70)
            .sort((a, b) => a.masteryScore - b.masteryScore);
        for (const weak of weakTopics) {
            const resources = await Resource_1.Resource.find({ topic: weak.topicId }).limit(3);
            const difficulty = weak.masteryScore < 50 ? 'beginner' : 'intermediate';
            recommendations.push({
                userId,
                topicId: weak.topicId,
                topicName: weak.topicName,
                subject: weak.subject,
                reason: `Your performance in ${weak.topicName} is ${weak.masteryScore}%, which is below the proficiency threshold. ${weak.attempts >= 3
                    ? 'Consider reviewing prerequisite material or trying a different learning approach.'
                    : 'Additional practice is recommended.'}`,
                resources: resources.map((r) => r._id),
                priority: priority++,
                difficulty,
                status: 'pending',
            });
        }
        // 2. Recommend next topics in sequence for subjects of interest
        for (const subject of subjects) {
            const topics = await Topic_1.Topic.find({ subject }).sort({ order: 1 });
            const subjectProgress = allProgress.filter((p) => p.subject === subject);
            const progressMap = new Map(subjectProgress.map((p) => [p.topicId.toString(), p]));
            for (const topic of topics) {
                const progress = progressMap.get(topic._id.toString());
                if (!progress || progress.status === 'not_started') {
                    // Check prerequisites
                    const prereqsMet = topic.prerequisites.every((prereqId) => {
                        const pp = progressMap.get(prereqId.toString());
                        return pp && pp.masteryScore >= 70;
                    });
                    if (prereqsMet || topic.prerequisites.length === 0) {
                        const resources = await Resource_1.Resource.find({ topic: topic._id }).limit(3);
                        recommendations.push({
                            userId,
                            topicId: topic._id,
                            topicName: topic.name,
                            subject,
                            reason: `This is the next recommended topic in your ${subject} learning path.`,
                            resources: resources.map((r) => r._id),
                            priority: priority++,
                            difficulty: topic.difficulty,
                            status: 'pending',
                        });
                        break; // Only recommend one per subject
                    }
                }
            }
        }
        // 3. Recommend topics ready for mastery assessment (score 60-79%)
        const almostMastered = allProgress
            .filter((p) => p.masteryScore >= 60 && p.masteryScore < 80)
            .sort((a, b) => b.masteryScore - a.masteryScore);
        for (const topic of almostMastered.slice(0, 2)) {
            const resources = await Resource_1.Resource.find({ topic: topic.topicId, type: 'practice' }).limit(2);
            recommendations.push({
                userId,
                topicId: topic.topicId,
                topicName: topic.topicName,
                subject: topic.subject,
                reason: `You're close to mastering ${topic.topicName} (${topic.masteryScore}%). Take a mastery assessment to level up!`,
                resources: resources.map((r) => r._id),
                priority: priority++,
                difficulty: 'intermediate',
                status: 'pending',
            });
        }
        const created = await Recommendation_1.Recommendation.insertMany(recommendations);
        const populated = await Recommendation_1.Recommendation.find({ _id: { $in: created.map((r) => r._id) } })
            .populate('resources')
            .sort({ priority: 1 });
        res.json({ success: true, data: populated });
    }
    catch (error) {
        next(error);
    }
};
exports.generateRecommendations = generateRecommendations;
const updateRecommendation = async (req, res, next) => {
    try {
        const recommendation = await Recommendation_1.Recommendation.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { status: req.body.status }, { new: true }).populate('resources');
        if (!recommendation) {
            res.status(404).json({ success: false, error: 'Recommendation not found' });
            return;
        }
        res.json({ success: true, data: recommendation });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRecommendation = updateRecommendation;
//# sourceMappingURL=recommendationController.js.map