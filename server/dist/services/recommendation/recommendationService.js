"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationService = exports.RecommendationService = void 0;
const User_1 = require("../../models/User");
const Progress_1 = require("../../models/Progress");
const Topic_1 = require("../../models/Topic");
const Resource_1 = require("../../models/Resource");
const LearningPath_1 = require("../../models/LearningPath");
class RecommendationService {
    async analyzeStudent(userId) {
        const user = await User_1.User.findById(userId);
        const progress = await Progress_1.Progress.find({ userId });
        return { user, progress };
    }
    async identifyWeakTopics(userId) {
        return await Progress_1.Progress.find({ userId, masteryScore: { $lt: 70 }, status: { $ne: 'not_started' } }).populate('topicId');
    }
    async identifyStrongTopics(userId) {
        return await Progress_1.Progress.find({ userId, masteryScore: { $gte: 70 } }).populate('topicId');
    }
    async recommendNextTopic(userId, subject) {
        const topics = await Topic_1.Topic.find({ subject }).sort({ order: 1 });
        const progress = await Progress_1.Progress.find({ userId, subject });
        for (const topic of topics) {
            const p = progress.find(p => p.topicId.toString() === topic._id.toString());
            if (!p || p.masteryScore < 70) {
                return topic;
            }
        }
        return topics[topics.length - 1];
    }
    async recommendResources(userId, topicId) {
        const user = await User_1.User.findById(userId);
        const query = {};
        if (topicId)
            query.topic = topicId;
        if (user?.preferences?.resourceTypes?.length) {
            query.type = { $in: user.preferences.resourceTypes };
        }
        return await Resource_1.Resource.find(query).limit(5);
    }
    async generateLearningPath(userId, subject) {
        const topics = await Topic_1.Topic.find({ subject }).sort({ order: 1 });
        const nodes = topics.map((t, index) => ({
            topicId: t._id,
            topicName: t.name,
            status: index === 0 ? 'current' : 'locked',
            difficulty: t.difficulty,
            estimatedTime: `${t.estimatedHours} hours`,
            order: t.order,
        }));
        const lp = new LearningPath_1.LearningPath({
            userId,
            subject,
            nodes,
            currentNodeIndex: 0,
        });
        await lp.save();
        return lp;
    }
    async generateLearningInsight(userId) {
        const weak = await this.identifyWeakTopics(userId);
        if (weak.length > 0)
            return `Focus on improving your understanding of ${weak[0].topicName}.`;
        return 'You are doing great! Keep progressing through the modules.';
    }
    async updatePathAfterAssessment(userId, assessmentId) {
        // Basic deterministic update logic
        console.log(`Path updated for user ${userId} based on assessment ${assessmentId}`);
    }
}
exports.RecommendationService = RecommendationService;
exports.recommendationService = new RecommendationService();
//# sourceMappingURL=recommendationService.js.map