'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { key: string; label: string; total: number }[];
  color?: string;
  height?: number;
}

// Barres horizontales avec étiquette de catégorie directement sur l'axe —
// l'identité vient du texte, pas de la couleur (donc pas besoin d'une
// palette catégorielle multi-teinte ni de sa validation CVD : une seule
// teinte suffit, la longueur de la barre porte la comparaison).
export default function CategoryBarChart({ data, color = '#0057FF', height = 220 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 0, bottom: 0 }}
        barCategoryGap={12}
      >
        <CartesianGrid stroke="#E1E8F2" strokeDasharray="0" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fill: '#74839C', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fill: '#3D4A61', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={130}
        />
        <Tooltip
          formatter={(value) => [value, 'Total']}
          contentStyle={{ borderRadius: 10, border: '1px solid #E1E8F2', fontSize: 12.5 }}
          cursor={{ fill: '#EDF2FA' }}
        />
        <Bar dataKey="total" fill={color} radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
