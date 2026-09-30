import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    interests: [] as string[],
    goals: [] as string[],
    resourceTypes: [] as string[],
    studyTimePerDay: 60,
    difficultyProgression: 'moderate' as 'slow' | 'moderate' | 'fast',
  });

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await authService.updateProfile({
        interests: preferences.interests,
        goals: preferences.goals,
        preferences: {
          resourceTypes: preferences.resourceTypes.length > 0 ? preferences.resourceTypes : ['video', 'article', 'interactive'],
          studyTimePerDay: preferences.studyTimePerDay,
          difficultyProgression: preferences.difficultyProgression,
          learningStyle: 'visual',
        },
        onboardingCompleted: true,
      });
      updateUser(res.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update profile', error);
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const toggleSelection = (field: 'interests' | 'goals' | 'resourceTypes', value: string) => {
    setPreferences(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's personalize your experience</h1>
        <p className="text-gray-600">Tell us a bit about yourself so we can adapt to your learning style.</p>
        <ProgressBar progress={(step / 4) * 100} className="mt-6" />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-card border border-gray-100">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">What subjects are you interested in?</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Art'].map(subject => (
                <div
                  key={subject}
                  onClick={() => toggleSelection('interests', subject)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    preferences.interests.includes(subject) ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-100 hover:border-primary-200 text-gray-700'
                  }`}
                >
                  {subject}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">What are your learning goals?</h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                'Prepare for an exam',
                'Learn a new skill for my career',
                'Help with school coursework',
                'Personal enrichment & curiosity'
              ].map(goal => (
                <div
                  key={goal}
                  onClick={() => toggleSelection('goals', goal)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    preferences.goals.includes(goal) ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-100 hover:border-primary-200 text-gray-700'
                  }`}
                >
                  {goal}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">How do you prefer to learn?</h2>
            <p className="text-sm text-gray-500">Select the types of resources you find most helpful.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'video', label: 'Videos & Lectures' },
                { id: 'article', label: 'Articles & Text' },
                { id: 'interactive', label: 'Interactive Exercises' },
                { id: 'practice', label: 'Practice Questions' }
              ].map(type => (
                <div
                  key={type.id}
                  onClick={() => toggleSelection('resourceTypes', type.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    preferences.resourceTypes.includes(type.id) ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-100 hover:border-primary-200 text-gray-700'
                  }`}
                >
                  {type.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Pacing & Commitment</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How much time can you dedicate per day? (Minutes)
              </label>
              <input 
                type="range" 
                min="15" 
                max="180" 
                step="15"
                value={preferences.studyTimePerDay}
                onChange={(e) => setPreferences({...preferences, studyTimePerDay: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="text-center mt-2 font-bold text-primary-600 text-xl">
                {preferences.studyTimePerDay} mins
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred difficulty progression:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'slow', label: 'Slow & Steady' },
                  { id: 'moderate', label: 'Moderate' },
                  { id: 'fast', label: 'Fast & Challenging' }
                ].map(prog => (
                  <div
                    key={prog.id}
                    onClick={() => setPreferences({...preferences, difficultyProgression: prog.id as any})}
                    className={`p-3 text-center rounded-xl border-2 cursor-pointer transition-all text-sm ${
                      preferences.difficultyProgression === prog.id ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-100 hover:border-primary-200 text-gray-700'
                    }`}
                  >
                    {prog.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
          <Button variant="ghost" onClick={prevStep} disabled={step === 1 || loading}>
            Back
          </Button>
          {step < 4 ? (
            <Button onClick={nextStep}>
              Next Step
            </Button>
          ) : (
            <Button onClick={handleComplete} isLoading={loading}>
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
