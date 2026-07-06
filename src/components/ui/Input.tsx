import { InputHTMLAttributes, forwardRef } from 'react';
import { ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#9CA3AF] text-base pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              w-full bg-white border border-[#E5E0D8] rounded-[8px]
              py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF]
              focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10
              transition-all
              ${leftIcon ? 'pl-10' : 'pl-4'}
              ${rightIcon ? 'pr-10' : 'pr-4'}
              ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''}
              ${className}
            `}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[#9CA3AF] text-base">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-[#EF4444]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;