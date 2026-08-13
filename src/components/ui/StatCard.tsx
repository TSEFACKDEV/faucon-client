import { IconType } from 'react-icons';

interface Props {
  label: string;
  value: string | number;
  icon: IconType;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}

const toneStyles = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600' },
  success: { bg: 'bg-success-tint', icon: 'text-success-strong' },
  warning: { bg: 'bg-warning-tint', icon: 'text-warning-strong' },
  danger:  { bg: 'bg-danger-tint', icon: 'text-danger-strong' },
};

export default function StatCard({ label, value, icon: Icon, tone = 'primary' }: Props) {
  const t = toneStyles[tone];
  return (
    <div className="card-hover bg-white rounded-[14px] border border-neutral-100 shadow-[0_1px_3px_rgba(33,31,27,0.05)] p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-[12px] ${t.bg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={t.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-neutral-900 leading-tight">{value}</p>
        <p className="text-xs text-neutral-600 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}
