import React, { useState, useEffect } from 'react';
import { assessmentService } from '../services/assessmentService';
import { Assessment } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Target, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AssessmentList: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await assessmentService.getAssessments();
        setAssessments(res.data);
      } catch (error) {
        console.error('Failed to fetch assessments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const handleCreateNew = async (subject: string) => {
    setCreating(true);
    try {
      const res = await assessmentService.createInitialAssessment(subject);
      navigate(`/assessments/${res.data.assessment._id}`);
    } catch (error) {
      console.error('Failed to create assessment', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-500 mt-1">Test your knowledge and update your learning path.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-primary-50 border-primary-100 flex flex-col justify-center items-center text-center p-8 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">New Assessment</h3>
          <p className="text-sm text-gray-600 mb-6">Take a test to update your mastery level in a subject.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {user?.interests.map(subject => (
              <Button 
                key={subject} 
                size="sm" 
                onClick={() => handleCreateNew(subject)}
                isLoading={creating}
              >
                {subject}
              </Button>
            ))}
          </div>
        </Card>

        {loading ? (
          <div className="col-span-2 flex justify-center py-12"><Spinner /></div>
        ) : assessments.length === 0 ? (
          <div className="col-span-2">
            <EmptyState
              icon={<Target />}
              title="No assessments taken"
              description="You haven't taken any assessments yet. Start one to establish your baseline knowledge."
            />
          </div>
        ) : (
          assessments.map(assessment => (
            <Card key={assessment._id} hoverable onClick={() => navigate(`/assessments/${assessment._id}/result`)} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">{assessment.subject}</span>
                <Badge variant={assessment.score >= 80 ? 'success' : assessment.score >= 60 ? 'warning' : 'error'}>
                  {assessment.score}%
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 capitalize">{assessment.type} Assessment</h3>
              <p className="text-sm text-gray-500 mb-6 flex-grow">
                {assessment.topicResults.length} topics covered • {assessment.totalQuestions} questions
              </p>
              <div className="flex items-center text-xs font-medium text-gray-400 mt-auto pt-4 border-t border-gray-100">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(assessment.completedAt).toLocaleDateString()}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AssessmentList;
