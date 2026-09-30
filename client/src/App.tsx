import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import LearningPathPage from './pages/LearningPathPage';
import AssessmentList from './pages/AssessmentList';
import TakeAssessment from './pages/TakeAssessment';
import AssessmentResult from './pages/AssessmentResult';
import Resources from './pages/Resources';
import ProgressPage from './pages/ProgressPage';
import AIAssistant from './pages/AIAssistant';
import { useAuth } from './context/AuthContext';


const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.onboardingCompleted) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
};

const DashboardRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/onboarding" element={
        <OnboardingRoute>
          <Onboarding />
        </OnboardingRoute>
      } />

      <Route element={
        <DashboardRoute>
          <MainLayout />
        </DashboardRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/assessments" element={<AssessmentList />} />
        <Route path="/assessments/:id" element={<TakeAssessment />} />
        <Route path="/assessments/:id/result" element={<AssessmentResult />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
      </Route>
    </Routes>
  );
}

export default App;
