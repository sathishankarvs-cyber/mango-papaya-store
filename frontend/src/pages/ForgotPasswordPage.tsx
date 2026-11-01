import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data?.message || 'Password reset link sent to your email.');
      if (res.data?.data?.resetToken) {
        setResetToken(res.data.data.resetToken);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl block">🔑</span>
          <h1 className="text-2xl font-black text-stone-900">Forgot Password</h1>
          <p className="text-xs text-stone-500">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {message && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-900">
            <p className="font-semibold">{message}</p>
            {resetToken && (
              <div className="pt-2 border-t border-amber-200/60">
                <p className="text-[11px] text-stone-500 font-bold">Dev/Testing Token:</p>
                <code className="text-[10px] break-all bg-white p-1.5 rounded block mt-1">{resetToken}</code>
                <Link
                  to={`/reset-password?token=${resetToken}`}
                  className="inline-block mt-2 text-amber-700 font-bold underline"
                >
                  Proceed to Reset Password →
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white shadow-md flex items-center justify-center space-x-2 transition-all"
          >
            <span>{loading ? 'Sending Instructions...' : 'Send Reset Instructions'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs">
          <Link to="/login" className="font-bold text-stone-600 hover:text-amber-700">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
