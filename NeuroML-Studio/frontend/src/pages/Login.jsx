import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [email, setEmail] = useState('demo.engineer@neuroml.ai');
  const [password, setPassword] = useState('demo123');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      try {
        await login('demo.engineer@neuroml.ai', 'demo123');
      } catch (loginErr) {
        // Auto-provision demo account on first use in Neon DB
        await register('Demo Engineer', 'demo.engineer@neuroml.ai', 'demo123');
      }
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Could not authenticate demo user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#151E32] border border-[#27334A] rounded-2xl shadow-2xl p-8 relative z-10 flex flex-col gap-6">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-glow-purple">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            NeuroML <span className="text-purple-400">Studio</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access your machine learning models and experiments.
          </p>
        </div>

        {/* Demo Fast Track Button */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          className="w-full py-2.5 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 text-purple-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Quick Demo Access (One-Click)</span>
        </button>

        <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase font-semibold">
          <div className="flex-1 h-px bg-[#27334A]" />
          <span>Or sign in with email</span>
          <div className="flex-1 h-px bg-[#27334A]" />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neu-input w-full pl-9 py-2"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neu-input w-full pl-9 py-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            rightIcon={ArrowRight}
            className="w-full mt-2 py-2.5"
          >
            Sign In to Studio
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
