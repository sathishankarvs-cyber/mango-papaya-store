import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface LayoutProps {
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};