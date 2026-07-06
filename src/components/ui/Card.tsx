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
        bg-white rounded-[12px] border border-[#E5E0D8]
        shadow-[0_1px_4px_rgba(0,0,0,0.06)]
        ${padding ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}