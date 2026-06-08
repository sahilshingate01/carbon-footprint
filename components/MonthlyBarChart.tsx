'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { MonthlyAggregate } from '@/types';
import { CATEGORY_COLORS } from '@/lib/constants';

interface MonthlyBarChartProps {
  data: MonthlyAggregate[];
}

export default function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-mute">
        No monthly data yet.
      </div>
    );
  }

  const chartData = data.map((m) => ({
    name: m.month,
    Transport: m.breakdown.transport,
    Energy: m.breakdown.energy,
    Diet: m.breakdown.diet,
  }));

  return (
    <div className="h-72 w-full" id="monthly-bar-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-body ml-1">{value}</span>
            )}
          />
          <Bar dataKey="Transport" fill={CATEGORY_COLORS.transport} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Energy" fill={CATEGORY_COLORS.energy} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Diet" fill={CATEGORY_COLORS.diet} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
