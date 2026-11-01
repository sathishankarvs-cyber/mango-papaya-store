import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenParam = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Password reset token is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl block">🔒</span>
          <h1 className="text-2xl font-black text-stone-900">Reset Password</h1>
          <p className="text-xs text-stone-500">Create a new secure password for your account</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm">Password Updated Successfully!</h4>
            <p className="text-xs text-stone-600">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Reset Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token from reset email"
                className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  minLength={6}
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
