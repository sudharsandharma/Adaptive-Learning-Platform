import React, { useState, useEffect } from 'react';
import { progressService } from '../services/progressService';
import { ProgressStats } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ChartCard } from '../components/ChartCard';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ProgressPage: React.FC = () => {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await progressService.getStats();
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch progress stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (!stats) return <div className="text-center py-20 text-red-500">Failed to load progress data.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-gray-500 mt-1">Detailed analytics of your learning journey.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Overall Assessment Scores" description="Your performance trend over time">
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.recentScores}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[0, 100]} />
                <Tooltip contentStyle={{borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1', strokeWidth: 0}} activeDot={{r: 6, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Subject Mastery Map" description="Your strengths across different subjects">
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.subjectProgress}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#94a3b8'}} />
                <Radar name="Mastery" dataKey="mastery" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                <Tooltip contentStyle={{borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Strongest Topics</h3>
          <div className="space-y-4">
            {stats.strongTopics.map((topic, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1 text-sm font-medium">
                  <span className="text-gray-700">{topic.topicName}</span>
                  <span className="text-accent-600">{topic.score}%</span>
                </div>
                <ProgressBar progress={topic.score} showPercentage={false} color="bg-accent-500" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Topics to Review</h3>
          <div className="space-y-4">
            {stats.weakTopics.map((topic, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1 text-sm font-medium">
                  <span className="text-gray-700">{topic.topicName}</span>
                  <span className="text-red-500">{topic.score}%</span>
                </div>
                <ProgressBar progress={topic.score} showPercentage={false} color="bg-red-500" />
              </div>
            ))}
            {stats.weakTopics.length === 0 && (
              <p className="text-gray-500 text-sm italic text-center py-4">No weak topics right now!</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
