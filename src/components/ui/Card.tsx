import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className = '', padding = true }: Props) {
  return (
    <div
      className={`
        bg-white rounded-[14px] border border-neutral-100
        shadow-[0_1px_3px_rgba(33,31,27,0.05)]
        ${padding ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
