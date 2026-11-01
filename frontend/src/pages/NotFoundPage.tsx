import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <span className="text-8xl block animate-pulse">🥭</span>
      <h1 className="text-4xl font-black text-stone-900">404 - Page Not Found</h1>
      <p className="text-sm text-stone-500 max-w-sm mx-auto">
        The branch you are looking for might have been pruned or moved to a different grove.
      </p>
      <div className="pt-2 flex items-center justify-center space-x-3">
        <Link
          to="/"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-full shadow-md flex items-center space-x-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/products"
          className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-full"
        >
          Explore All Fruits
        </Link>
      </div>
    </div>
  );
};
