import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <ShieldCheckIcon className="w-7 h-7 text-white" />
            </div>
            <span className="ml-4 text-2xl font-bold text-white tracking-tight">SAR Generator</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Compliance Management
            <span className="block text-primary-200">Made Simple</span>
          </h1>
          <p className="text-lg text-primary-200/80 max-w-md leading-relaxed">
            AI-powered Suspicious Activity Report narrative generation with
            comprehensive audit trails and regulatory compliance.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-sm text-primary-300 mt-1">Compliance Rate</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-primary-300 mt-1">Monitoring</div>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-10">
            <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-primary-900">SAR Generator</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-primary-900">Welcome back</h2>
            <p className="text-primary-500 mt-2">Sign in to access your compliance dashboard</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-gray-200 p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="form-label">
                  Email / Username
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email or username"
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pr-10"
                    placeholder="Enter your password"
                  />
                  <LockClosedIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Secure authentication protected by industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
