'use client';

import { memo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { EmissionBreakdown } from '@/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import { SHARED_TOOLTIP_STYLE, formatPieEmissions } from '@/lib/chartConfig';

interface EmissionPieChartProps {
  /**
   * The breakdown of emissions across categories (transport, energy, diet).
   */
  emissions: EmissionBreakdown;
}

const CHART_COLORS = [
  CATEGORY_COLORS.transport,
  CATEGORY_COLORS.energy,
  CATEGORY_COLORS.diet,
];

/**
 * EmissionPieChart renders a Recharts Pie chart displaying the breakdown
 * of weekly carbon emissions by category (Transport, Energy, Diet).
 */
const EmissionPieChart = memo(function EmissionPieChart({ emissions }: EmissionPieChartProps) {
  const data = [
    { name: 'Transport', value: emissions.transport, color: CHART_COLORS[0] },
    { name: 'Energy', value: emissions.energy, color: CHART_COLORS[1] },
    { name: 'Diet', value: emissions.diet, color: CHART_COLORS[2] },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-mute">
        No emission data to display
      </div>
    );
  }

  return (
    <div className="h-72 w-full" id="emission-pie-chart" role="img" aria-label="Pie chart showing emission breakdown by category">
      <div className="sr-only">
        <table>
          <caption>Carbon emissions breakdown by category</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Emissions (kg CO₂)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.value.toFixed(1)} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            {...SHARED_TOOLTIP_STYLE}
            formatter={formatPieEmissions}
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default EmissionPieChart;
