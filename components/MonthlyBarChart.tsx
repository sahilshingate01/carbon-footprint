'use client';

import { memo } from 'react';
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
import { SHARED_TOOLTIP_STYLE, formatEmissions } from '@/lib/chartConfig';

interface MonthlyBarChartProps {
  /**
   * Summarized data aggregated per month.
   */
  data: MonthlyAggregate[];
}

/**
 * MonthlyBarChart renders a stacked Recharts Bar chart, enabling users
 * to perform a month-by-month analysis of their carbon footprint categories.
 */
const MonthlyBarChart = memo(function MonthlyBarChart({ data }: MonthlyBarChartProps) {
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
    <div className="h-72 w-full" id="monthly-bar-chart" role="img" aria-label="Bar chart showing monthly emissions breakdown by category">
      <div className="sr-only">
        <table>
          <caption>Monthly emissions breakdown by category</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Transport (kg CO₂)</th>
              <th scope="col">Energy (kg CO₂)</th>
              <th scope="col">Diet (kg CO₂)</th>
              <th scope="col">Total (kg CO₂)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.Transport.toFixed(1)} kg</td>
                <td>{item.Energy.toFixed(1)} kg</td>
                <td>{item.Diet.toFixed(1)} kg</td>
                <td>{(item.Transport + item.Energy + item.Diet).toFixed(1)} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
          />
          <Tooltip
            {...SHARED_TOOLTIP_STYLE}
            formatter={formatEmissions}
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
});

export default MonthlyBarChart;
