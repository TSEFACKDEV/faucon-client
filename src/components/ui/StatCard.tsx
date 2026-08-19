import { IconType } from 'react-icons';

interface Props {
  label: string;
  value: string | number;
  icon: IconType;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}

const toneStyles = {
  primary: { bg: 'bg-gradient-to-br from-primary-500 to-accent-400', glow: 'shadow-[0_4px_14px_rgba(0,87,255,0.3)]' },
  success: { bg: 'bg-gradient-to-br from-success to-success-strong', glow: 'shadow-[0_4px_14px_rgba(34,197,94,0.28)]' },
  warning: { bg: 'bg-gradient-to-br from-warning to-warning-strong', glow: 'shadow-[0_4px_14px_rgba(245,158,11,0.28)]' },
  danger:  { bg: 'bg-gradient-to-br from-danger to-danger-strong', glow: 'shadow-[0_4px_14px_rgba(239,68,68,0.28)]' },
};

export default function StatCard({ label, value, icon: Icon, tone = 'primary' }: Props) {
  const t = toneStyles[tone];
  return (
    <div className="card-hover bg-white rounded-[16px] border border-neutral-100 shadow-[0_2px_10px_rgba(11,21,38,0.05)] p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-[12px] ${t.bg} ${t.glow} flex items-center justify-center shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-neutral-900 leading-tight tracking-tight">{value}</p>
        <p className="text-xs text-neutral-600 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}
