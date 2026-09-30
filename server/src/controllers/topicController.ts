import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Topic } from '../models/Topic';
import { Resource } from '../models/Resource';

export const getTopics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query: any = {};
    if (req.query.subject) query.subject = req.query.subject;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;

    const topics = await Topic.find(query)
      .sort({ subject: 1, order: 1 })
      .populate('prerequisites', 'name slug');

    res.json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
};

export const getTopic = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('prerequisites', 'name slug difficulty');

    if (!topic) {
      res.status(404).json({ success: false, error: 'Topic not found' });
      return;
    }

    const resources = await Resource.find({ topic: topic._id });

    res.json({ success: true, data: { topic, resources } });
  } catch (error) {
    next(error);
  }
};
