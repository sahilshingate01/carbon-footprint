'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { WeeklyEntry } from '@/types';

interface EmissionTrendChartProps {
  entries: WeeklyEntry[];
}

export default function EmissionTrendChart({ entries }: EmissionTrendChartProps) {
  const data = entries.map((entry, index) => ({
    name: `W${entry.weekNumber}`,
    total: entry.emissions.total,
    transport: entry.emissions.transport,
    energy: entry.emissions.energy,
    diet: entry.emissions.diet,
    score: entry.ecoScore.score,
    index,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-mute">
        No trend data yet. Start tracking to see your progress.
      </div>
    );
  }

  return (
    <div className="h-72 w-full" id="emission-trend-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#007cf0" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#007cf0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis
            dataKey="name"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              background: '#171717',
              border: '1px solid #222',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#ededed',
            }}
            itemStyle={{ color: '#a1a1a1' }}
            labelStyle={{ color: '#ededed', fontWeight: 500 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any) => [`${Number(value).toFixed(2)} kg CO₂`]) as any}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#007cf0"
            strokeWidth={2}
            fill="url(#gradTotal)"
            dot={{ fill: '#007cf0', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
