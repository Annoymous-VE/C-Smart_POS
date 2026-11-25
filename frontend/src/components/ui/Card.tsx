import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  header,
  title,
  subtitle,
  action,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  };

  const hasHeader = header || title || subtitle || action;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {hasHeader && (
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          {header ? (
            header
          ) : (
            <div>
              {title && <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">{title}</h3>}
              {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          )}
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
};
