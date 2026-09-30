import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ClipboardCheck, Brain, Route, RefreshCw, Target, Sparkles, TrendingUp, AlertTriangle, BarChart3, Heart, Wifi, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Landing: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTryDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await authService.login({
        email: 'aarav@demo.nomad.edu',
        password: 'demo123456',
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch {
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">NOMAD</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleTryDemo} isLoading={demoLoading}>
              Try Demo
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Start Learning</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-primary-50 border border-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Adaptive Education Platform</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          Learning that <span className="text-primary-600">adapts</span> to you.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          An AI-powered personalized learning platform that understands how you learn, identifies what you need next, and continuously adapts your learning path.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">Start Learning</Button>
          </Link>
          <Button
            variant="accent"
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-4"
            onClick={handleTryDemo}
            isLoading={demoLoading}
          >
            Launch Live Demo (Aarav)
          </Button>
          <a href="#how-it-works" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">See How It Works</Button>
          </a>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-2 block">The Challenge</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The problem with one-size-fits-all education</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Students have different abilities, interests, and learning speeds, while traditional educational systems provide identical content and learning paths to everyone. Some students struggle with missing prerequisites, while others are held back. NOMAD dynamically maps education to each student's unique needs.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-2 block">Core Loop</span>
            <h2 className="text-3xl font-bold text-gray-900">How NOMAD Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <ClipboardCheck className="w-8 h-8" />, title: 'ASSESS', desc: 'Understand your current knowledge baseline across topics and prerequisites.' },
              { icon: <Brain className="w-8 h-8" />, title: 'UNDERSTAND', desc: 'Analyze your performance, learning pace, and preferred resource formats.' },
              { icon: <Route className="w-8 h-8" />, title: 'PERSONALIZE', desc: 'Build an individualized learning path prioritizing weak prerequisite areas.' },
              { icon: <RefreshCw className="w-8 h-8" />, title: 'ADAPT', desc: 'Continuously update your path and difficulty based on new performance.' },
            ].map((step, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-card border border-gray-100">
                <div className="w-16 h-16 mx-auto bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-primary-600 mb-1">STEP {i + 1}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-2 block">Capabilities</span>
            <h2 className="text-3xl font-bold text-gray-900">Built for Adaptive Mastery</h2>
          </div>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
            {[
              { icon: <Route />, title: 'Personalized Learning Paths', desc: 'Dynamic topic sequences ordered by prerequisites and mastery.' },
              { icon: <Target />, title: 'Adaptive Assessments', desc: 'Targeted quizzes that diagnose topic-level strengths and gaps.' },
              { icon: <Sparkles />, title: 'AI Recommendations', desc: 'Context-aware study guidance powered by your real performance.' },
              { icon: <TrendingUp />, title: 'Progress Tracking', desc: 'Track mastery scores, attempt history, and daily streaks.' },
              { icon: <AlertTriangle />, title: 'Weak-Topic Detection', desc: 'Automatically identifies bottlenecks before moving to advanced topics.' },
              { icon: <BookOpen />, title: 'Resource Matching', desc: 'Curated videos, articles, and interactive labs matched to your style.' },
              { icon: <BarChart3 />, title: 'Learning Analytics', desc: 'Visual breakdowns of subject mastery and score trends.' },
              { icon: <Heart />, title: 'Accessible by Design', desc: 'Lightweight, keyboard-friendly, and built for all learners.' },
            ].map((feat, i) => (
              <div key={i} className="p-6 border border-gray-100 rounded-2xl hover:shadow-card-hover transition-shadow bg-surface-50/50">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{feat.title}</h3>
                <p className="text-sm text-gray-600">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility & Inclusion Section */}
      <section className="py-20 bg-surface-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card border border-gray-100 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-accent-700 bg-accent-50 px-3 py-1 rounded-full mb-4">
                <Globe className="w-3.5 h-3.5" />
                <span>Accessibility & Inclusion</span>
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Designed for every learner, everywhere.
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                NOMAD is built to remain fast and practical in low-resource educational environments and for students who do not have access to expensive private tutoring or high-speed broadband.
              </p>
              <div className="space-y-3">
                {[
                  'Bandwidth indicators (Low / Medium / High) on every learning resource',
                  'Text-based & offline-friendly PDF alternatives when video isn’t feasible',
                  'Deterministic recommendation engine fallback when AI connectivity is unavailable',
                  'High-contrast, keyboard-accessible UI with clear semantic structure',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-50 rounded-2xl p-6 border border-gray-100 space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Wifi className="w-5 h-5 text-accent-600" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Low-Bandwidth Mode Ready</div>
                    <div className="text-xs text-gray-500">Prioritizes lightweight articles & interactive text</div>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-accent-50 text-accent-700 px-2.5 py-1 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Resilient Hybrid Engine</div>
                    <div className="text-xs text-gray-500">AI insights + deterministic prerequisite rules</div>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">100% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Start your personalized learning journey.</h2>
          <p className="text-primary-200 mb-8 text-lg">
            Join NOMAD today or explore the platform immediately with our pre-loaded demo student profile.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button variant="accent" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">Start Learning Free</Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-4"
              onClick={handleTryDemo}
              isLoading={demoLoading}
            >
              Explore Demo Student (Aarav)
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
