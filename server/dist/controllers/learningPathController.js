"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLearningPath = exports.generateLearningPath = exports.getLearningPath = void 0;
const LearningPath_1 = require("../models/LearningPath");
const Topic_1 = require("../models/Topic");
const Progress_1 = require("../models/Progress");
const getLearningPath = async (req, res, next) => {
    try {
        const query = { userId: req.user._id };
        if (req.query.subject)
            query.subject = req.query.subject;
        const paths = await LearningPath_1.LearningPath.find(query).sort({ updatedAt: -1 });
        res.json({ success: true, data: paths });
    }
    catch (error) {
        next(error);
    }
};
exports.getLearningPath = getLearningPath;
const generateLearningPath = async (req, res, next) => {
    try {
        const { subject } = req.body;
        if (!subject) {
            res.status(400).json({ success: false, error: 'Subject is required' });
            return;
        }
        const userId = req.user._id;
        // Delete existing path for this subject
        await LearningPath_1.LearningPath.deleteMany({ userId, subject });
        // Get all topics for the subject, ordered
        const topics = await Topic_1.Topic.find({ subject }).sort({ order: 1 });
        if (topics.length === 0) {
            res.status(404).json({ success: false, error: 'No topics found for this subject' });
            return;
        }
        // Get existing progress
        const progressRecords = await Progress_1.Progress.find({ userId, subject });
        const progressMap = new Map(progressRecords.map((p) => [p.topicId.toString(), p]));
        // Build nodes with proper status based on progress
        let foundCurrent = false;
        const nodes = topics.map((topic, index) => {
            const progress = progressMap.get(topic._id.toString());
            let status = 'locked';
            let score;
            let reason;
            if (progress) {
                score = progress.masteryScore;
                if (progress.status === 'mastered' || progress.masteryScore >= 80) {
                    status = 'completed';
                }
                else if (progress.status === 'proficient' || progress.status === 'in_progress') {
                    if (!foundCurrent) {
                        status = 'current';
                        foundCurrent = true;
                        reason = progress.masteryScore < 70
                            ? `Your current score is ${progress.masteryScore}%. Focus on improving this topic.`
                            : `You're doing well at ${progress.masteryScore}%. A bit more practice to master it.`;
                    }
                    else {
                        status = 'available';
                    }
                }
            }
            else {
                // No progress yet
                if (index === 0 && !foundCurrent) {
                    status = 'current';
                    foundCurrent = true;
                    reason = 'Start your learning journey here!';
                }
                else if (!foundCurrent) {
                    // Check if all prerequisites are completed
                    const prereqsMet = topic.prerequisites.every((prereqId) => {
                        const prereqProgress = progressMap.get(prereqId.toString());
                        return prereqProgress && prereqProgress.masteryScore >= 70;
                    });
                    if (prereqsMet || topic.prerequisites.length === 0) {
                        if (!foundCurrent) {
                            status = 'current';
                            foundCurrent = true;
                            reason = 'This is your next recommended topic based on your progress.';
                        }
                        else {
                            status = 'available';
                        }
                    }
                }
            }
            return {
                topicId: topic._id,
                topicName: topic.name,
                status,
                difficulty: topic.difficulty,
                estimatedTime: `${topic.estimatedHours}h`,
                score,
                reason,
                order: topic.order,
            };
        });
        const currentNodeIndex = nodes.findIndex((n) => n.status === 'current');
        const learningPath = await LearningPath_1.LearningPath.create({
            userId,
            subject,
            nodes,
            currentNodeIndex: currentNodeIndex >= 0 ? currentNodeIndex : 0,
        });
        res.json({ success: true, data: learningPath });
    }
    catch (error) {
        next(error);
    }
};
exports.generateLearningPath = generateLearningPath;
const updateLearningPath = async (req, res, next) => {
    try {
        const path = await LearningPath_1.LearningPath.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!path) {
            res.status(404).json({ success: false, error: 'Learning path not found' });
            return;
        }
        if (req.body.nodes)
            path.nodes = req.body.nodes;
        if (req.body.currentNodeIndex !== undefined)
            path.currentNodeIndex = req.body.currentNodeIndex;
        path.updatedAt = new Date();
        await path.save();
        res.json({ success: true, data: path });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLearningPath = updateLearningPath;
//# sourceMappingURL=learningPathController.js.map