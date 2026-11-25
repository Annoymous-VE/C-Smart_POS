import React, { forwardRef } from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  helperText,
  error,
  icon,
  children,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`block w-full text-xs rounded-lg border bg-white text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:cursor-not-allowed cursor-pointer appearance-none ${
            icon ? 'pl-9 pr-8' : 'pl-3 pr-8'
          } py-2 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
              : 'border-slate-200 focus:border-[#0D9488] focus:ring-[#0D9488]/20'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error ? (
        <p className="text-[11px] text-rose-600 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
