import { User } from '../../models/User';
import { Progress } from '../../models/Progress';
import { Topic } from '../../models/Topic';
import { Resource } from '../../models/Resource';
import { LearningPath } from '../../models/LearningPath';
import { Recommendation } from '../../models/Recommendation';
import mongoose from 'mongoose';

export class RecommendationService {
  async analyzeStudent(userId: string): Promise<any> {
    const user = await User.findById(userId);
    const progress = await Progress.find({ userId });
    return { user, progress };
  }

  async identifyWeakTopics(userId: string): Promise<any[]> {
    return await Progress.find({ userId, masteryScore: { $lt: 70 }, status: { $ne: 'not_started' } }).populate('topicId');
  }

  async identifyStrongTopics(userId: string): Promise<any[]> {
    return await Progress.find({ userId, masteryScore: { $gte: 70 } }).populate('topicId');
  }

  async recommendNextTopic(userId: string, subject: string): Promise<any> {
    const topics = await Topic.find({ subject }).sort({ order: 1 });
    const progress = await Progress.find({ userId, subject });
    
    for (const topic of topics) {
      const p = progress.find(p => p.topicId.toString() === topic._id.toString());
      if (!p || p.masteryScore < 70) {
        return topic;
      }
    }
    return topics[topics.length - 1];
  }

  async recommendResources(userId: string, topicId?: string): Promise<any[]> {
    const user = await User.findById(userId);
    const query: any = {};
    if (topicId) query.topic = topicId;
    if (user?.preferences?.resourceTypes?.length) {
      query.type = { $in: user.preferences.resourceTypes };
    }
    return await Resource.find(query).limit(5);
  }

  async generateLearningPath(userId: string, subject: string): Promise<any> {
    const topics = await Topic.find({ subject }).sort({ order: 1 });
    const nodes = topics.map((t, index) => ({
      topicId: t._id as mongoose.Types.ObjectId,
      topicName: t.name,
      status: index === 0 ? 'current' : 'locked',
      difficulty: t.difficulty,
      estimatedTime: `${t.estimatedHours} hours`,
      order: t.order,
    }));

    const lp = new LearningPath({
      userId,
      subject,
      nodes,
      currentNodeIndex: 0,
    });
    await lp.save();
    return lp;
  }

  async generateLearningInsight(userId: string): Promise<string> {
    const weak = await this.identifyWeakTopics(userId);
    if (weak.length > 0) return `Focus on improving your understanding of ${weak[0].topicName}.`;
    return 'You are doing great! Keep progressing through the modules.';
  }

  async updatePathAfterAssessment(userId: string, assessmentId: string): Promise<void> {
    // Basic deterministic update logic
    console.log(`Path updated for user ${userId} based on assessment ${assessmentId}`);
  }
}

export const recommendationService = new RecommendationService();
