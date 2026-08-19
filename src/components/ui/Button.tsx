import { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:   'bg-gradient-to-r from-primary-600 to-accent-400 text-white border border-transparent shadow-[0_4px_16px_rgba(0,87,255,0.28)] hover:shadow-[0_6px_20px_rgba(0,87,255,0.4)] hover:brightness-105',
  secondary: 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50',
  danger:    'bg-white text-danger-strong border border-danger-strong hover:bg-danger-tint',
  ghost:     'bg-transparent text-neutral-600 hover:bg-neutral-50 border border-transparent',
  accent:    'bg-gradient-to-r from-gold-400 to-gold-500 text-primary-900 border border-transparent shadow-[0_4px_16px_rgba(255,176,0,0.3)] hover:brightness-105',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-[10px] font-semibold
        transition-all duration-200 ease-out
        cursor-pointer active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
