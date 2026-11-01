import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { Bell, User, HelpCircle, Sun, Moon } from 'lucide-react';

interface TopBarProps {
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onLogout }) => {
  const { admin } = useAdminAuthStore();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-slate-500 hidden sm:block">
          Welcome back, {admin?.name || 'Admin'}
        </span>
        <div className="flex space-x-2">
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Notifications">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Help">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-3 text-sm text-slate-600">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>System online</span>
        </div>
        <div className="flex items-center space-x-2 p-1 bg-slate-100 rounded-lg">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'Admin')}&background=random&color=fff`}
            alt={admin?.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-slate-800">{admin?.name || 'Admin'}</span>
          <button
            onClick={onLogout}
            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign out"
          >
            <span className="sr-only">Sign out</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};