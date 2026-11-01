import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data?.data) {
        login(res.data.data.token, res.data.data.user);
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl block">🍈</span>
          <h1 className="text-2xl font-black text-stone-900">Create Account</h1>
          <p className="text-xs text-stone-500">Join our community for authentic, tree-ripened tropical harvests</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-10 pr-4 py-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

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

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Password</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? <span>Creating Account...</span> : <span>Create Account</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-600">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-amber-700 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
