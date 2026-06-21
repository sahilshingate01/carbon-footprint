'use client';

import { memo } from 'react';
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
import { SHARED_TOOLTIP_STYLE, formatEmissions } from '@/lib/chartConfig';

interface EmissionTrendChartProps {
  /**
   * List of historical weekly entries to plot the emission trends.
   */
  entries: WeeklyEntry[];
}

/**
 * EmissionTrendChart renders a Recharts Area chart demonstrating the progression
 * of total emissions and individual categories over the tracked weeks.
 */
const EmissionTrendChart = memo(function EmissionTrendChart({ entries }: EmissionTrendChartProps) {
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
    <div className="h-72 w-full" id="emission-trend-chart" role="img" aria-label="Line chart showing weekly emission trend over time">
      <div className="sr-only">
        <table>
          <caption>Weekly emissions trend over time</caption>
          <thead>
            <tr>
              <th scope="col">Week</th>
              <th scope="col">Total Emissions (kg CO₂)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.index}>
                <td>{item.name}</td>
                <td>{item.total.toFixed(1)} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2d8a4e" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#2d8a4e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5df" />
          <XAxis
            dataKey="name"
            stroke="#8a8a8a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#8a8a8a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}`}
          />
          <Tooltip
            {...SHARED_TOOLTIP_STYLE}
            formatter={formatEmissions}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#2d8a4e"
            strokeWidth={2}
            fill="url(#gradTotal)"
            dot={{ fill: '#2d8a4e', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export default EmissionTrendChart;
