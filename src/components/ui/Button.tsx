import { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:   'bg-[#1B4332] text-white hover:bg-[#2D6A4F] border border-[#1B4332]',
  secondary: 'bg-white text-[#1B4332] border border-[#1B4332] hover:bg-[#F5F0E8]',
  danger:    'bg-white text-[#EF4444] border border-[#EF4444] hover:bg-[#FEE2E2]',
  ghost:     'bg-transparent text-[#6B7280] hover:bg-[#F5F0E8] border border-transparent',
  accent:    'bg-[#F59E0B] text-white hover:bg-[#D97706] border border-[#F59E0B]',
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
        rounded-[8px] font-semibold
        transition-all duration-150
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
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