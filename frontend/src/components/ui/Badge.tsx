import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'amber' | 'rose' | 'blue' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  const variantClasses = {
    teal: 'bg-teal-50 text-teal-800 border border-teal-200/80',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    rose: 'bg-rose-50 text-rose-800 border border-rose-200/80',
    blue: 'bg-blue-50 text-blue-800 border border-blue-200/80',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'bg-transparent text-slate-600 border border-slate-300',
  };

  const dotClasses = {
    teal: 'bg-teal-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
    slate: 'bg-slate-400',
    outline: 'bg-slate-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md leading-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClasses[variant]}`} />}
      {children}
    </span>
  );
};
