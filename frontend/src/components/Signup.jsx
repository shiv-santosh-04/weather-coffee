import React, { useState } from 'react';
import { UserPlus, User, Lock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

/**
 * Signup Component
 * Handles new user registration.
 */
export default function Signup({ setView }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic Validation
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Let's inspect responses:
      // Case 1: User already exists -> {"message": "user already exists"}
      // Case 2: Success -> {"message": {"user created successfully"}} in python, which serializes to {"message": ["user created successfully"]}
      
      const message = data.message;

      if (message === 'user already exists' || (typeof message === 'string' && message.toLowerCase().includes('exist'))) {
        setError('User already exists. Choose a different username.');
      } else if (
        (Array.isArray(message) && message.some(val => val.toLowerCase().includes('created'))) ||
        (typeof message === 'string' && message.toLowerCase().includes('created'))
      ) {
        setSuccess('Account created successfully! Redirecting to login page...');
        
        // Auto-redirect to Login after 2 seconds
        setTimeout(() => {
          setView('login');
        }, 2000);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Could not connect to the backend server. Make sure it is running on http://localhost:8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-pink-500/10 blur-2xl" />
        
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Join PokePortal to discover and inspect Pokemon data
          </p>
        </div>

        {/* Banners */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200 animate-fadeIn">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-200 animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || success}
                className="block w-full rounded-lg bg-slate-900/60 border border-slate-700/50 text-white placeholder-slate-500 pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
                className="block w-full rounded-lg bg-slate-900/60 border border-slate-700/50 text-white placeholder-slate-500 pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
                placeholder="Choose a password (min 4 chars)"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-pink-500/25"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Link back to Login */}
        <div className="mt-8 text-center border-t border-white/5 pt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => setView('login')}
            className="text-pink-400 hover:text-pink-300 font-semibold transition-all hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}
