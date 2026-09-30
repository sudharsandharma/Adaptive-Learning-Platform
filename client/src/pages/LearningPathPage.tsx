import React, { useState, useEffect } from 'react';
import { learningPathService } from '../services/learningPathService';
import { assessmentService } from '../services/assessmentService';
import { LearningPath } from '../types';
import { LearningPathNode } from '../components/LearningPathNode';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Route, Wand2, RefreshCw, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ALL_SUBJECTS = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'English'];

const LearningPathPage: React.FC = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<string[]>(ALL_SUBJECTS);
  const [activeSubject, setActiveSubject] = useState<string>('Computer Science');
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [startingQuiz, setStartingQuiz] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.interests && user.interests.length > 0) {
      const merged = Array.from(new Set([...user.interests, ...ALL_SUBJECTS]));
      setSubjects(merged);
      setActiveSubject(user.interests[0]);
    }
  }, [user]);

  useEffect(() => {
    if (!activeSubject) return;

    const fetchPath = async () => {
      setLoading(true);
      try {
        const res = await learningPathService.getLearningPath(activeSubject);
        setPath(res.data);
      } catch (error: any) {
        setPath(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPath();
  }, [activeSubject]);

  const handleGenerate = async () => {
    if (!activeSubject) return;
    setGenerating(true);
    try {
      const res = await learningPathService.generateLearningPath(activeSubject);
      setPath(res.data);
    } catch (error) {
      console.error('Failed to generate path', error);
    } finally {
      setGenerating(false);
    }
  };

  const handlePracticeCurrentTopic = async (topicId: string) => {
    setStartingQuiz(true);
    try {
      const res = await assessmentService.createPracticeAssessment(activeSubject, [topicId]);
      navigate(`/assessments/${res.data.assessment._id}`);
    } catch (error) {
      console.error('Failed to start topic quiz', error);
    } finally {
      setStartingQuiz(false);
    }
  };

  const currentNode = path?.nodes.find(n => n.status === 'current');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Learning Path</h1>
          <p className="text-gray-500 mt-1">A dynamically generated sequence tailored to your prerequisites and mastery.</p>
        </div>

        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 overflow-x-auto w-full md:w-auto">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSubject === subject ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size="lg" /></div>
      ) : !path ? (
        <EmptyState
          icon={<Route />}
          title="No path generated yet"
          description={`You don't have a learning path for ${activeSubject} yet. Let NOMAD generate a personalized path based on your goals and current knowledge.`}
          actionLabel="Generate Learning Path"
          onAction={handleGenerate}
        />
      ) : generating ? (
        <div className="py-32 flex flex-col items-center justify-center text-center">
          <Wand2 className="w-12 h-12 text-primary-500 animate-pulse mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Building your adaptive path...</h3>
          <p className="text-gray-500">Analyzing prerequisites and difficulty progression.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentNode && (
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                  Current Recommended Focus
                </span>
                <h3 className="text-2xl font-bold mt-2">{currentNode.topicName}</h3>
                <p className="text-primary-100 text-sm mt-1 max-w-xl">
                  {currentNode.reason || 'Recommended next based on your current proficiency.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-primary-700 hover:bg-primary-50"
                  onClick={() => navigate(`/resources?topic=${currentNode.topicId}`)}
                >
                  Study Resources
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  icon={<PlayCircle className="w-4 h-4" />}
                  isLoading={startingQuiz}
                  onClick={() => handlePracticeCurrentTopic(currentNode.topicId)}
                >
                  Take Topic Assessment
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
            <div className="mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-1 block">Subject Path</span>
                <h2 className="text-2xl font-bold">{path.subject}</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-sm text-gray-500 block">Completion</span>
                  <span className="text-xl font-bold text-gray-900">
                    {Math.round((path.nodes.filter(n => n.status === 'completed').length / path.nodes.length) * 100)}%
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleGenerate} icon={<RefreshCw className="w-4 h-4" />}>
                  Recalculate
                </Button>
              </div>
            </div>

            <div className="space-y-0">
              {path.nodes.map((node, idx) => (
                <LearningPathNode
                  key={node.topicId}
                  node={node}
                  isLast={idx === path.nodes.length - 1}
                  onClick={() => {
                    if (node.status !== 'locked') {
                      navigate(`/resources?topic=${node.topicId}`);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPathPage;
