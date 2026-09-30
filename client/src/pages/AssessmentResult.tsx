import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService } from '../services/assessmentService';
import { Assessment } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { ArrowLeft, RefreshCw, ChevronRight, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AssessmentQuestion } from '../components/AssessmentQuestion';

const AssessmentResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await assessmentService.getAssessment(id!);
        setAssessment(res.data);
      } catch (error) {
        console.error('Failed to fetch assessment results', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAssessment();
  }, [id]);

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (!assessment) return <div className="text-center py-20 text-red-500">Assessment results not found.</div>;

  const scoreClass = assessment.score >= 80 ? 'text-accent-500' : assessment.score >= 60 ? 'text-yellow-500' : 'text-red-500';
  const grade = assessment.score >= 80 ? 'Excellent' : assessment.score >= 60 ? 'Good' : 'Needs Improvement';

  const strongTopics = assessment.topicResults.filter(t => t.percentage >= 70);
  const weakTopics = assessment.topicResults.filter(t => t.percentage < 70);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <Button variant="ghost" size="sm" onClick={() => navigate('/assessments')} icon={<ArrowLeft className="w-4 h-4" />}>
        Back to Assessments
      </Button>

      <Card className="text-center p-10">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-2 block">Your Result</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{assessment.subject} Assessment Complete</h2>
        <p className="text-gray-500 mb-8">We've analyzed your performance and adapted your learning path.</p>

        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="none" />
              <circle
                cx="50" cy="50" r="40"
                className={scoreClass}
                strokeWidth="8"
                stroke="currentColor"
                fill="none"
                strokeDasharray={`${assessment.score * 2.51} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-5xl font-extrabold ${scoreClass}`}>{assessment.score}%</span>
              <span className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">{grade}</span>
            </div>
          </div>
        </div>

        {/* Summary Insights */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8 text-left">
          <div className="p-4 rounded-xl bg-accent-50 border border-accent-100">
            <div className="flex items-center space-x-2 text-accent-700 font-semibold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Strong Areas</span>
            </div>
            <p className="text-sm text-gray-700">
              {strongTopics.length > 0
                ? strongTopics.map(t => `${t.topicName} (${t.percentage}%)`).join(', ')
                : 'Keep practicing to build strong mastery!'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <div className="flex items-center space-x-2 text-red-700 font-semibold text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Needs Improvement</span>
            </div>
            <p className="text-sm text-gray-700">
              {weakTopics.length > 0
                ? weakTopics.map(t => `${t.topicName} (${t.percentage}%)`).join(', ')
                : 'None! You scored well across all tested topics.'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 max-w-2xl mx-auto mb-8 text-sm text-primary-900">
          <strong>Recommended Next Step: </strong>
          {weakTopics.length > 0
            ? `Review ${weakTopics[0].topicName} resources before moving to advanced concepts.`
            : `Great job! Your learning path has been updated and you're ready for the next topic.`}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => navigate('/learning-path')} icon={<RefreshCw className="w-4 h-4" />}>
            View Updated Learning Path
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')} icon={<ChevronRight className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Topic-Level Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {assessment.topicResults.map((result, idx) => (
            <Card key={idx} className="p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900 truncate pr-4">{result.topicName}</span>
                <span className={`font-bold ${result.percentage >= 80 ? 'text-accent-600' : result.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {result.percentage}%
                </span>
              </div>
              <ProgressBar
                progress={result.percentage}
                showPercentage={false}
                color={result.percentage >= 80 ? 'bg-accent-500' : result.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
              />
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>{result.percentage >= 80 ? 'Mastered' : result.percentage >= 60 ? 'Proficient' : 'Needs Review'}</span>
                <span>{result.correct} / {result.total} correct</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {assessment.questions && assessment.questions.length > 0 && (assessment.questions[0] as any).options && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-900">Question Review & Explanations</h3>
          </div>
          <div className="space-y-6">
            {assessment.questions.map((q: any, idx: number) => (
              <Card key={idx} className="p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Question {idx + 1} • {q.topicName}
                </div>
                <AssessmentQuestion
                  question={q}
                  selectedAnswer={q.selectedAnswer}
                  showCorrect={true}
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentResult;
