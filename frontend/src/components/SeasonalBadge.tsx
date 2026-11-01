import React from 'react';
import { StockStatus } from '../types';

interface SeasonalBadgeProps {
  stockStatus: StockStatus;
  isSeasonallyAvailable: boolean;
  seasonalMessage?: string;
  className?: string;
}

export const SeasonalBadge: React.FC<SeasonalBadgeProps> = ({
  stockStatus,
  isSeasonallyAvailable,
  seasonalMessage,
  className = '',
}) => {
  if (!isSeasonallyAvailable || stockStatus === 'SEASONAL_UNAVAILABLE') {
    return (
      <span
        title={seasonalMessage || 'Unavailable due to season'}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
        Seasonal Unavailable
      </span>
    );
  }

  if (stockStatus === 'OUT_OF_STOCK') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
        Out of Stock
      </span>
    );
  }

  if (stockStatus === 'LOW_STOCK') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />
        Only Few Left!
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
      Fresh Harvest Ready
    </span>
  );
};
