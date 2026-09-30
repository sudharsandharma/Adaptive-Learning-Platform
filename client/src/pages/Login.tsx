import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      login(res.data.token, res.data.user);
      if (res.data.user.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setDemoLoading(true);
    try {
      const res = await authService.login({
        email: 'aarav@demo.nomad.edu',
        password: 'demo123456',
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo student not found. Please ensure database is seeded.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome back</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Log in to continue your adaptive learning path</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Demo Student Quick Login */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Instant Demo Mode
          </span>
          <span className="text-xs text-gray-500">CS Student Profile</span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Explore NOMAD immediately as <strong>Aarav</strong> (Python 88%, Functions 81%, Recursion 43%).
        </p>
        <Button
          type="button"
          variant="accent"
          size="sm"
          className="w-full"
          onClick={handleDemoLogin}
          isLoading={demoLoading}
        >
          Log in as Demo Student (Aarav)
        </Button>
      </div>

      <div className="relative flex py-2 items-center mb-5">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">Or sign in with email</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full" isLoading={loading}>
          Log in
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
