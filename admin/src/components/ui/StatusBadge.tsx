import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className,
}) => {
  const statusClasses: Record<string, string> = {
    PLACED: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-amber-100 text-amber-800',
    PROCESSING: 'bg-amber-100 text-amber-800',
    PACKED: 'bg-amber-100 text-amber-800',
    OUT_FOR_DELIVERY: 'bg-amber-100 text-amber-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    'OUT_OF_STOCK': 'bg-red-100 text-red-800',
    AVAILABLE: 'bg-green-100 text-green-800',
    LOW_STOCK: 'bg-amber-100 text-amber-800',
    SEASONAL_UNAVAILABLE: 'bg-slate-100 text-slate-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs rounded',
    md: 'px-3 py-1 text-sm rounded',
    lg: 'px-4 py-2 text-base rounded',
  };

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} ${statusClasses[status] || 'bg-slate-100 text-slate-700'} ${className}`}
    >
      {status}
    </span>
  );
};