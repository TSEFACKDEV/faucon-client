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
  '0-20':   '#B91C1C', // danger — critique
  '21-50':  '#B45309', // warning — sérieux
  '51-80':  '#F59E0B', // warning clair — correct
  '81-100': '#15803D', // success — bon
};

export default function BatteryBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }} barCategoryGap={16}>
        <CartesianGrid stroke="#E1E8F2" strokeDasharray="0" vertical={false} />
        <XAxis dataKey="tranche" tick={{ fill: '#74839C', fontSize: 11 }} axisLine={{ stroke: '#C9D3E3' }} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: '#74839C', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
        <Tooltip
          formatter={(value) => [value, 'Traceurs']}
          labelFormatter={(l) => `Batterie ${l}%`}
          contentStyle={{ borderRadius: 10, border: '1px solid #E1E8F2', fontSize: 12.5 }}
          cursor={{ fill: '#EDF2FA' }}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((entry) => (
            <Cell key={entry.tranche} fill={COULEUR_PAR_TRANCHE[entry.tranche] ?? '#0057FF'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
