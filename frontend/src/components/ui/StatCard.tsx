import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm transition ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 border border-teal-100/80">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight">
          {value}
        </div>
        {trend && (
          <span
            className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
              trend.positive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-slate-500 mt-1 truncate">{subtitle}</p>
      )}
    </div>
  );
};
