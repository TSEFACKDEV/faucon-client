'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props {
  data: { date: string; total: number }[];
}

export default function GrowthLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#E8E5E0" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'd MMM', { locale: fr })}
          tick={{ fill: '#857E72', fontSize: 11 }}
          axisLine={{ stroke: '#D7D2CA' }}
          tickLine={false}
          interval={Math.ceil(data.length / 6)}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#857E72', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          labelFormatter={(d) => format(parseISO(String(d)), 'd MMMM yyyy', { locale: fr })}
          formatter={(value) => [value, 'Nouveaux comptes']}
          contentStyle={{ borderRadius: 10, border: '1px solid #E8E5E0', fontSize: 12.5 }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#363F70"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#363F70', stroke: '#FFFFFF', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
