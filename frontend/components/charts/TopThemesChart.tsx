'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { themes } from '@/lib/mock-data';

export function TopThemesChart() {
  const data = [...themes]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((t) => ({
      name: t.name,
      count: t.count,
      color: t.color,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
          }}
          cursor={{ fill: '#f1f5f9' }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
