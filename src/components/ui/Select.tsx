import { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export default function Select({ label, error, className = '', children, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full bg-white border border-neutral-100 rounded-[10px]
          py-2.5 px-3.5 text-sm text-neutral-900
          focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10
          transition-all duration-150 cursor-pointer
          ${error ? 'border-danger-strong focus:border-danger-strong focus:ring-danger-strong/10' : ''}
          ${className}
        `}
      >
        {children}
      </select>
      {error && <p className="text-xs text-danger-strong">{error}</p>}
    </div>
  );
}
