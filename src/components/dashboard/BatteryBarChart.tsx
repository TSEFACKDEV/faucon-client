'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  data: { tranche: string; total: number }[];
}

// Palette de statut fixe (jamais thémée) : chaque tranche de batterie porte
// une sévérité réelle (faible -> critique, pleine -> bonne), donc la couleur
// encode un état, pas une identité arbitraire — usage légitime d'une teinte
// par barre sans repasser par la validation catégorielle.
const COULEUR_PAR_TRANCHE: Record<string, string> = {
  '0-20':   '#B23434', // danger — critique
  '21-50':  '#8A5E10', // warning — sérieux
  '51-80':  '#E3A72E', // warning clair — correct
  '81-100': '#1F7A50', // success — bon
};

export default function BatteryBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }} barCategoryGap={16}>
        <CartesianGrid stroke="#E8E5E0" strokeDasharray="0" vertical={false} />
        <XAxis dataKey="tranche" tick={{ fill: '#857E72', fontSize: 11 }} axisLine={{ stroke: '#D7D2CA' }} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: '#857E72', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
        <Tooltip
          formatter={(value) => [value, 'Traceurs']}
          labelFormatter={(l) => `Batterie ${l}%`}
          contentStyle={{ borderRadius: 10, border: '1px solid #E8E5E0', fontSize: 12.5 }}
          cursor={{ fill: '#F3F1EE' }}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((entry) => (
            <Cell key={entry.tranche} fill={COULEUR_PAR_TRANCHE[entry.tranche] ?? '#363F70'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
