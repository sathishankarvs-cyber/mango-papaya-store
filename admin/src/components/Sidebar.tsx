import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  BarChart3,
  CreditCard,
  Package,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: Box },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`}
    >
      {/* Sidebar header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🥭</span>
          <span className="text-xl font-black tracking-tight text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            PSN Farm Admin
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-600/40 shadow-[0_0_15px_rgba(234,179,8,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setIsOpen(false)}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)} />
      )}
    </aside>

    {/* Mobile menu button */}
    <button
      className="lg:hidden p-3 text-slate-900 hover:bg-amber-100 rounded-lg shadow-md"
      onClick={() => setIsOpen(true)}
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6" />
    </button>
  </>);
};