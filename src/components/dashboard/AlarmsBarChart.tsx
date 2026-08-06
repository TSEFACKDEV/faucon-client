'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props {
  data: { date: string; total: number }[];
}

export default function AlarmsBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }} barCategoryGap={10}>
        <CartesianGrid stroke="#E8E5E0" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'EEEEEE', { locale: fr })}
          tick={{ fill: '#857E72', fontSize: 11 }}
          axisLine={{ stroke: '#D7D2CA' }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#857E72', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          labelFormatter={(d) => format(parseISO(String(d)), 'EEEE d MMMM', { locale: fr })}
          formatter={(value) => [value, 'Alarmes']}
          contentStyle={{ borderRadius: 10, border: '1px solid #E8E5E0', fontSize: 12.5 }}
          cursor={{ fill: '#F3F1EE' }}
        />
        <Bar dataKey="total" fill="#B23434" radius={[4, 4, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
