import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/progressService';
import { aiService } from '../services/aiService';
import { learningPathService } from '../services/learningPathService';
import { recommendationService } from '../services/recommendationService';
import { ProgressStats, LearningPath, Recommendation } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ChartCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Award, Target, Zap, AlertCircle, ArrowRight, PlayCircle, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [insight, setInsight] = useState<string>('');
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, insightRes, pathsRes, recsRes] = await Promise.allSettled([
          progressService.getStats(),
          aiService.getLearningInsight(),
          learningPathService.getLearningPaths(),
          recommendationService.getRecommendations(),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (insightRes.status === 'fulfilled') setInsight(insightRes.value.data.insight);
        if (pathsRes.status === 'fulfilled') setLearningPaths(pathsRes.value.data);
        if (recsRes.status === 'fulfilled') setRecommendations(recsRes.value.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  if (!stats) return <div className="py-20 text-center text-red-500">Failed to load data. Please refresh.</div>;

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Get current learning path node
  const currentPath = learningPaths[0];
  const currentNode = currentPath?.nodes?.find(n => n.status === 'current');

  // Format chart dates
  const chartData = stats.recentScores.map(s => ({
    ...s,
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
        <p className="text-gray-500">{dateStr}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Overall Mastery" value={`${Math.round(stats.overallMastery)}%`} icon={<Award className="w-5 h-5" />} />
        <StatCard title="Topics Mastered" value={stats.topicsMastered} icon={<Target className="w-5 h-5" />} />
        <StatCard title="Current Streak" value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`} icon={<Zap className="w-5 h-5" />} />
        <StatCard title="Needs Attention" value={stats.weakTopics.length} icon={<AlertCircle className="w-5 h-5" />} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning Card */}
          <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white mb-4">
                  {currentNode ? 'Continue Learning' : 'Get Started'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  {currentNode
                    ? `${currentNode.topicName}`
                    : 'Start Your Learning Journey'}
                </h2>
                <p className="text-primary-100 max-w-md mb-6 text-sm">
                  {currentNode?.reason ||
                    (currentPath
                      ? `Continue your ${currentPath.subject} learning path.`
                      : 'Generate a learning path to get personalized topic recommendations.')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/learning-path">
                    <Button variant="secondary" className="text-primary-700 bg-white hover:bg-primary-50" icon={<PlayCircle className="w-5 h-5" />}>
                      {currentNode ? 'Continue' : 'Start Path'}
                    </Button>
                  </Link>
                  <Link to="/assessments">
                    <Button variant="secondary" className="text-primary-700 bg-white/80 hover:bg-white">
                      Take Assessment
                    </Button>
                  </Link>
                </div>
              </div>
              {currentNode?.score !== undefined && (
                <div className="text-center bg-white/10 rounded-2xl p-4 min-w-[80px]">
                  <div className="text-3xl font-bold">{currentNode.score}%</div>
                  <div className="text-xs text-primary-200 mt-1">Current Score</div>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Performance Chart */}
          {chartData.length > 0 && (
            <ChartCard title="Recent Performance" description="Your assessment scores over time">
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`${value}%`, 'Score']}
                    />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Insight */}
          <Card className="bg-gradient-to-br from-accent-50 to-white border border-accent-100">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent-600" />
              <h3 className="text-lg font-bold text-gray-900">AI Insight</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {insight || 'Start taking assessments to get personalized learning insights.'}
            </p>
            <Link to="/ai-assistant">
              <Button variant="accent" size="sm" className="w-full">Chat with Assistant</Button>
            </Link>
          </Card>

          {/* Needs Attention */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Needs Attention</h3>
              <Link to="/progress" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            {stats.weakTopics.length > 0 ? (
              <div className="space-y-3">
                {stats.weakTopics.slice(0, 4).map((topic, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                    <span className="font-medium text-gray-900 text-sm truncate pr-4">{topic.topicName}</span>
                    <span className="text-red-600 font-bold text-sm bg-white px-2 py-1 rounded-md shadow-sm whitespace-nowrap">
                      {topic.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                No weak topics right now. Great job! 🎉
              </div>
            )}
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-gray-900">Recommended</h3>
              </div>
              <div className="space-y-3">
                {recommendations.slice(0, 3).map((rec) => (
                  <div key={rec._id} className="p-3 bg-primary-50 rounded-xl">
                    <div className="font-medium text-sm text-gray-900">{rec.topicName}</div>
                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">{rec.reason}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Subject Progress Chart */}
      {stats.subjectProgress.length > 0 && (
        <ChartCard title="Subject Progress" description="Your mastery level across different subjects">
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.subjectProgress} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 500 }} width={120} />
                <RechartsTooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}%`, 'Mastery']}
                />
                <Bar dataKey="mastery" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}
    </div>
  );
};

export default Dashboard;
