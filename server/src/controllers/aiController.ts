import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { aiService } from '../services/ai/aiService';
import { Progress } from '../models/Progress';
import { Assessment } from '../models/Assessment';
import { LearningPath } from '../models/LearningPath';
import { User } from '../models/User';
import { Recommendation } from '../models/Recommendation';

async function buildStudentContext(userId: string) {
  const [user, progress, assessments, learningPaths, recommendations] = await Promise.all([
    User.findById(userId).select('-passwordHash'),
    Progress.find({ userId }).sort({ masteryScore: 1 }),
    Assessment.find({ userId }).sort({ completedAt: -1 }).limit(5).select('-questions'),
    LearningPath.find({ userId }),
    Recommendation.find({ userId, status: 'pending' }).limit(5),
  ]);

  const weakTopics = progress.filter((p) => p.masteryScore > 0 && p.masteryScore < 70);
  const strongTopics = progress.filter((p) => p.masteryScore >= 70);

  return {
    studentProfile: {
      name: user?.name,
      educationLevel: user?.educationLevel,
      interests: user?.interests,
      preferences: user?.preferences,
      goals: user?.goals,
    },
    assessmentHistory: assessments.map((a) => ({
      subject: a.subject,
      score: a.score,
      date: a.completedAt,
      topicResults: a.topicResults,
    })),
    topicPerformance: progress.map((p) => ({
      topicName: p.topicName,
      subject: p.subject,
      masteryScore: p.masteryScore,
      status: p.status,
      attempts: p.attempts,
      recentScores: p.scores.slice(-3),
    })),
    weakTopics: weakTopics.map((p) => ({ topicName: p.topicName, score: p.masteryScore })),
    strongTopics: strongTopics.map((p) => ({ topicName: p.topicName, score: p.masteryScore })),
    currentLearningPaths: learningPaths.map((lp) => ({
      subject: lp.subject,
      currentNode: lp.nodes[lp.currentNodeIndex]?.topicName,
      progress: `${lp.nodes.filter((n) => n.status === 'completed').length}/${lp.nodes.length}`,
    })),
    activeRecommendations: recommendations.map((r) => ({
      topic: r.topicName,
      reason: r.reason,
    })),
  };
}

export const assistant = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ success: false, error: 'Message is required' });
      return;
    }

    const studentContext = await buildStudentContext(String(req.user!._id));

    let response: string;
    try {
      response = await aiService.answerStudentQuestion(message, studentContext);
    } catch {
      // Deterministic fallback
      response = generateDeterministicResponse(message, studentContext);
    }

    res.json({ success: true, data: { message: response, reply: response } });
  } catch (error) {
    next(error);
  }
};

export const learningInsight = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentContext = await buildStudentContext(String(req.user!._id));

    let insight: string;
    try {
      insight = await aiService.generateLearningInsight(studentContext);
    } catch {
      // Deterministic fallback
      insight = generateDeterministicInsight(studentContext);
    }

    res.json({ success: true, data: { insight } });
  } catch (error) {
    next(error);
  }
};

function generateDeterministicResponse(message: string, context: any): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('what should i study') || lowerMsg.includes('what should i learn') || lowerMsg.includes('study today')) {
    if (context.weakTopics.length > 0) {
      const weakest = context.weakTopics[0];
      return `Based on your performance data, I'd recommend focusing on **${weakest.topicName}** today. Your current mastery is ${weakest.score}%, and improving this area will strengthen your foundation. ${
        context.currentLearningPaths.length > 0
          ? `You're currently on the ${context.currentLearningPaths[0].subject} path, working on ${context.currentLearningPaths[0].currentNode || 'your next topic'}.`
          : ''
      }`;
    }
    return `Great question! Based on your profile, I'd suggest continuing with your current learning path. ${
      context.strongTopics.length > 0
        ? `You're doing well in ${context.strongTopics[0].topicName} (${context.strongTopics[0].score}%). Keep building on that momentum!`
        : 'Start with your first assessment to get personalized recommendations.'
    }`;
  }

  if (lowerMsg.includes('struggling') || lowerMsg.includes('difficult') || lowerMsg.includes('hard')) {
    if (context.weakTopics.length > 0) {
      const weak = context.weakTopics.slice(0, 3);
      const topicList = weak.map((w: any) => `${w.topicName} (${w.score}%)`).join(', ');
      return `I can see from your assessment data that you're finding these topics challenging: ${topicList}. Here's what I suggest: Start with the lowest-scoring topic and work through the recommended resources. Try different resource types if one approach isn't clicking. Remember, struggling is a natural part of learning!`;
    }
    return `It's completely normal to find some topics challenging. Take assessments to help me identify exactly where you need support, and I'll create a personalized plan to help you improve.`;
  }

  if (lowerMsg.includes('explain') || lowerMsg.includes('what is')) {
    return `I'd be happy to help explain that concept! For the best learning experience, I recommend checking out the resources in your learning path that cover this topic. They include videos, articles, and interactive exercises tailored to your learning style (${context.studentProfile.preferences?.learningStyle || 'visual'}).`;
  }

  if (lowerMsg.includes('practice') || lowerMsg.includes('questions') || lowerMsg.includes('quiz')) {
    if (context.weakTopics.length > 0) {
      return `Great idea to practice! I'd recommend starting with practice questions on **${context.weakTopics[0].topicName}** since that's where you have the most room for improvement (currently at ${context.weakTopics[0].score}%). Head to the Assessments page and start a practice assessment focused on your weak areas.`;
    }
    return `Ready to practice? Head to the Assessments page to take a practice quiz. You can choose any subject and topic to test your knowledge!`;
  }

  if (lowerMsg.includes('progress') || lowerMsg.includes('how am i doing')) {
    const mastered = context.topicPerformance.filter((t: any) => t.status === 'mastered').length;
    const total = context.topicPerformance.length;
    return `Here's a quick summary of your progress: You've mastered ${mastered} out of ${total} topics you've studied. ${
      context.strongTopics.length > 0
        ? `Your strongest area is ${context.strongTopics[0].topicName} at ${context.strongTopics[0].score}%.`
        : ''
    } ${
      context.weakTopics.length > 0
        ? `Your biggest opportunity for improvement is ${context.weakTopics[0].topicName} at ${context.weakTopics[0].score}%.`
        : ''
    } Check the Progress page for detailed analytics!`;
  }

  if (lowerMsg.includes('next') || lowerMsg.includes('what comes after')) {
    if (context.currentLearningPaths.length > 0) {
      const path = context.currentLearningPaths[0];
      return `On your ${path.subject} learning path, you're currently working on ${path.currentNode || 'your next topic'}. Your overall progress is ${path.progress} topics completed. Keep going!`;
    }
    return `Generate a learning path from the Learning Path page to see your recommended sequence of topics. I'll organize them based on prerequisites and your current knowledge!`;
  }

  return `Thanks for your question! Based on your learning profile, I can see you're interested in ${context.studentProfile.interests?.join(', ') || 'various subjects'}. ${
    context.weakTopics.length > 0
      ? `Your current focus area should be ${context.weakTopics[0].topicName}. `
      : ''
  }Feel free to ask me about what to study, your progress, practice recommendations, or any specific topic you'd like to understand better!`;
}

function generateDeterministicInsight(context: any): string {
  const { weakTopics, strongTopics, assessmentHistory, topicPerformance } = context;

  if (assessmentHistory.length >= 2) {
    const recent = assessmentHistory[0];
    const previous = assessmentHistory[1];
    const diff = recent.score - previous.score;

    if (diff > 0) {
      return `Great progress! Your ${recent.subject} score improved from ${previous.score}% to ${recent.score}% in your recent assessments. ${
        weakTopics.length > 0
          ? `Focus on ${weakTopics[0].topicName} next to continue your improvement streak.`
          : 'Keep up the excellent work!'
      }`;
    } else if (diff < 0) {
      return `Your recent ${recent.subject} assessment (${recent.score}%) was slightly lower than the previous one (${previous.score}%). Don't worry — this is normal! ${
        weakTopics.length > 0
          ? `Try reviewing ${weakTopics[0].topicName} with a different resource type.`
          : 'Review the topics covered and try again when you feel ready.'
      }`;
    }
  }

  if (strongTopics.length > 0 && weakTopics.length > 0) {
    return `You're excelling in ${strongTopics[0].topicName} (${strongTopics[0].score}%)! To balance your knowledge, spend some time on ${weakTopics[0].topicName} (${weakTopics[0].score}%), which needs the most attention.`;
  }

  if (topicPerformance.length > 0) {
    const mastered = topicPerformance.filter((t: any) => t.status === 'mastered').length;
    return `You've mastered ${mastered} topic${mastered !== 1 ? 's' : ''} so far. ${
      mastered > 0 ? 'Keep up the great work!' : 'Take your first assessment to start tracking your progress.'
    }`;
  }

  return 'Welcome to NOMAD! Start with an assessment to get personalized learning insights tailored to your strengths and areas for improvement.';
}
