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
          <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-neutral-500 text-base pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              w-full bg-white border border-neutral-100 rounded-[10px]
              py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500
              focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10
              transition-all duration-150
              ${leftIcon ? 'pl-10' : 'pl-4'}
              ${rightIcon ? 'pr-10' : 'pr-4'}
              ${error ? 'border-danger-strong focus:border-danger-strong focus:ring-danger-strong/10' : ''}
              ${className}
            `}
          />
          {rightIcon && (
            <span className="absolute right-3 text-neutral-500 text-base flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-danger-strong">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
