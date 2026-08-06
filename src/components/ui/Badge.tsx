import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  color?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary';
  dot?: boolean;
}

const colors = {
  success: 'bg-success-tint text-success-strong',
  warning: 'bg-warning-tint text-warning-strong',
  danger:  'bg-danger-tint text-danger-strong',
  neutral: 'bg-neutral-50 text-neutral-700',
  primary: 'bg-primary-50 text-primary-600',
};

const dots = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
  neutral: 'bg-neutral-500',
  primary: 'bg-primary-400',
};

export default function Badge({ children, color = 'neutral', dot = false }: Props) {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5
      rounded-full text-xs font-semibold whitespace-nowrap
      ${colors[color]}
    `}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dots[color]}`} />
      )}
      {children}
    </span>
  );
}
