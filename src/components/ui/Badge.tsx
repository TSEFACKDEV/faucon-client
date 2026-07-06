import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  color?: 'green' | 'orange' | 'red' | 'gray' | 'yellow';
  dot?: boolean;
}

const colors = {
  green:  'bg-[#D1FAE5] text-[#065F46]',
  orange: 'bg-[#FEF3C7] text-[#92400E]',
  red:    'bg-[#FEE2E2] text-[#991B1B]',
  gray:   'bg-[#F3F4F6] text-[#374151]',
  yellow: 'bg-[#FEF9C3] text-[#713F12]',
};

const dots = {
  green:  'bg-[#10B981]',
  orange: 'bg-[#F59E0B]',
  red:    'bg-[#EF4444]',
  gray:   'bg-[#9CA3AF]',
  yellow: 'bg-[#EAB308]',
};

export default function Badge({ children, color = 'gray', dot = false }: Props) {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5
      rounded-full text-xs font-semibold
      ${colors[color]}
    `}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dots[color]}`} />
      )}
      {children}
    </span>
  );
}