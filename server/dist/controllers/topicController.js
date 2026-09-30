"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopic = exports.getTopics = void 0;
const Topic_1 = require("../models/Topic");
const Resource_1 = require("../models/Resource");
const getTopics = async (req, res, next) => {
    try {
        const query = {};
        if (req.query.subject)
            query.subject = req.query.subject;
        if (req.query.difficulty)
            query.difficulty = req.query.difficulty;
        const topics = await Topic_1.Topic.find(query)
            .sort({ subject: 1, order: 1 })
            .populate('prerequisites', 'name slug');
        res.json({ success: true, data: topics });
    }
    catch (error) {
        next(error);
    }
};
exports.getTopics = getTopics;
const getTopic = async (req, res, next) => {
    try {
        const topic = await Topic_1.Topic.findById(req.params.id)
            .populate('prerequisites', 'name slug difficulty');
        if (!topic) {
            res.status(404).json({ success: false, error: 'Topic not found' });
            return;
        }
        const resources = await Resource_1.Resource.find({ topic: topic._id });
        res.json({ success: true, data: { topic, resources } });
    }
    catch (error) {
        next(error);
    }
};
exports.getTopic = getTopic;
//# sourceMappingURL=topicController.js.map