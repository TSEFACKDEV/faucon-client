'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { useLanguage } from '@/i18n/LanguageProvider';

interface Props {
  data: { date: string; total: number }[];
}

export default function AlarmsBarChart({ data }: Props) {
  const { language, tr } = useLanguage();
  const locale = language === 'en' ? enUS : fr;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }} barCategoryGap={10}>
        <CartesianGrid stroke="#E1E8F2" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'EEEEEE', { locale })}
          tick={{ fill: '#74839C', fontSize: 11 }}
          axisLine={{ stroke: '#C9D3E3' }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#74839C', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          labelFormatter={(d) => format(parseISO(String(d)), 'EEEE d MMMM', { locale })}
          formatter={(value) => [value, tr('Alarmes', 'Alerts')]}
          contentStyle={{ borderRadius: 10, border: '1px solid #E1E8F2', fontSize: 12.5 }}
          cursor={{ fill: '#EDF2FA' }}
        />
        <Bar dataKey="total" fill="#B91C1C" radius={[4, 4, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
