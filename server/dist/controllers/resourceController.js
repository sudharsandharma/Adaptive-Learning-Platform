"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedResources = exports.getResources = void 0;
const Resource_1 = require("../models/Resource");
const Progress_1 = require("../models/Progress");
const User_1 = require("../models/User");
const getResources = async (req, res, next) => {
    try {
        const query = {};
        if (req.query.subject)
            query.subject = req.query.subject;
        if (req.query.topic)
            query.topic = req.query.topic;
        if (req.query.type)
            query.type = req.query.type;
        if (req.query.difficulty)
            query.difficulty = req.query.difficulty;
        if (req.query.bandwidth)
            query.bandwidth = req.query.bandwidth;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const [resources, total] = await Promise.all([
            Resource_1.Resource.find(query).skip(skip).limit(limit).sort({ topicName: 1, difficulty: 1 }),
            Resource_1.Resource.countDocuments(query),
        ]);
        res.json({
            success: true,
            data: resources,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getResources = getResources;
const getRecommendedResources = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User_1.User.findById(userId);
        // Find weak topics
        const weakProgress = await Progress_1.Progress.find({
            userId,
            masteryScore: { $lt: 70 },
            status: { $ne: 'not_started' },
        }).sort({ masteryScore: 1 });
        // Find in-progress topics
        const inProgressTopics = await Progress_1.Progress.find({
            userId,
            status: 'in_progress',
        });
        const topicIds = [
            ...weakProgress.map((p) => p.topicId),
            ...inProgressTopics.map((p) => p.topicId),
        ];
        let query = {};
        if (topicIds.length > 0) {
            query.topic = { $in: topicIds };
        }
        // Prefer user's resource types
        if (user?.preferences?.resourceTypes?.length) {
            query.type = { $in: user.preferences.resourceTypes };
        }
        let resources = await Resource_1.Resource.find(query).limit(10);
        // If no resources found with preferences, fall back to all resources for those topics
        if (resources.length === 0 && topicIds.length > 0) {
            resources = await Resource_1.Resource.find({ topic: { $in: topicIds } }).limit(10);
        }
        // If still none, return general resources
        if (resources.length === 0) {
            const subjects = user?.interests || [];
            if (subjects.length > 0) {
                resources = await Resource_1.Resource.find({ subject: { $in: subjects } }).limit(10);
            }
            else {
                resources = await Resource_1.Resource.find({}).limit(10);
            }
        }
        res.json({ success: true, data: resources });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecommendedResources = getRecommendedResources;
//# sourceMappingURL=resourceController.js.map