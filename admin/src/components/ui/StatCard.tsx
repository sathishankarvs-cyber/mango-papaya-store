import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
  trend,
  trendValue,
}) => {
  const trendClass = trend === 'up'
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/25'
    : trend === 'down'
      ? 'bg-red-500/20 text-red-400 border-red-500/25'
      : 'bg-slate-500/20 text-slate-400 border-slate-500/25';

  const trendIcon = trend === 'up'
    ? <TrendingUp className="w-3.5 h-3.5 inline-block align-middle" />
    : trend === 'down'
      ? <svg className="w-3.5 h-3.5 inline-block align-middle"><path d="M19 14l-8-8L5 13l8 8Z" className="text-red-400"/></svg>
      : <svg className="w-3.5 h-3.5 inline-block align-middle"><path d="M9 12l2 2 4-4L13 11l-4-4L5 13l8 8Z" className="text-green-400"/></svg>;

  return (
    <div className={`bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 ${className} transition-all hover:border-slate-600/50 ${trendValue !== undefined ? 'border-y-2' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-slate-100">{typeof value === 'number' ? `$${value}` : value}</p>
          </div>
        </div>
        {trendValue !== undefined && (
          <div className="flex items-center space-x-1">
            {trendIcon}
            <p className="text-xs font-medium {trend === 'up' ? 'text-amber-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}">
              {trendValue}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};