import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService } from '../services/assessmentService';
import { Assessment, Question } from '../types';
import { AssessmentQuestion } from '../components/AssessmentQuestion';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { Clock } from 'lucide-react';

const TakeAssessment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // In a real app, the API would return the questions with the assessment if it's not completed.
    // Since we modeled it separately, let's just fetch the assessment details and assume questions are there.
    // For this mockup, if we just hit /assessments/:id, we get the assessment. 
    // We would need the full questions from the backend.
    
    const fetchAssessment = async () => {
      try {
        const res = await assessmentService.getAssessment(id!);
        // The endpoint should ideally return { assessment, questions } if not submitted
        // We'll mock this behavior based on our API design.
        // Assuming the backend handles state.
        setAssessment(res.data);
        // If it has questions array with question details
        if (res.data.questions && res.data.questions.length > 0 && (res.data.questions[0] as any).options) {
             setQuestions(res.data.questions as any);
        }
      } catch (error) {
        console.error('Failed to fetch assessment', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAssessment();
  }, [id]);

  useEffect(() => {
    if (questions.length > 0) {
      setTimeRemaining(questions.length * 60); // 1 minute per question
    }
  }, [questions]);

  useEffect(() => {
    if (timeRemaining > 0 && !submitting) {
      const timer = setTimeout(() => setTimeRemaining(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && questions.length > 0 && !submitting) {
      handleSubmit();
    }
  }, [timeRemaining, submitting, questions]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (index: number) => {
    setAnswers({ ...answers, [questions[currentIndex]._id]: index });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowConfirm(false);
    
    const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
      questionId: qId,
      selectedAnswer: ans,
      timeTaken: 0, // Simplified
    }));

    try {
      await assessmentService.submitAssessment(id!, formattedAnswers);
      navigate(`/assessments/${id}/result`);
    } catch (error) {
      console.error('Failed to submit assessment', error);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!assessment || questions.length === 0) return <div>Assessment not found or already completed.</div>;

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{assessment.subject} Assessment</h1>
          <p className="text-gray-500 text-sm">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold ${timeRemaining < 60 ? 'bg-red-50 text-red-600' : 'bg-surface-200 text-gray-700'}`}>
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <ProgressBar progress={((currentIndex + 1) / questions.length) * 100} showPercentage={false} className="mb-8" />

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8 mb-8 min-h-[400px]">
        <AssessmentQuestion
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion._id]}
          onSelectAnswer={handleSelectAnswer}
        />
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <Button 
          variant="secondary" 
          onClick={() => setCurrentIndex(c => c - 1)} 
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        
        <div className="text-sm text-gray-500 font-medium">
          {answeredCount} / {questions.length} answered
        </div>

        {isLast ? (
          <Button onClick={() => setShowConfirm(true)} disabled={answeredCount < questions.length}>
            Submit Assessment
          </Button>
        ) : (
          <Button 
            onClick={() => setCurrentIndex(c => c + 1)} 
            disabled={answers[currentQuestion._id] === undefined}
          >
            Next Question
          </Button>
        )}
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Submit Assessment">
        <p className="text-gray-600 mb-6">
          Are you sure you want to submit? You have answered {answeredCount} out of {questions.length} questions. You cannot change your answers after submitting.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={submitting}>Yes, Submit</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TakeAssessment;
