'use client';

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

interface EmissionPieChartProps {
  emissions: EmissionBreakdown;
}

const CHART_COLORS = [
  CATEGORY_COLORS.transport,
  CATEGORY_COLORS.energy,
  CATEGORY_COLORS.diet,
];

export default function EmissionPieChart({ emissions }: EmissionPieChartProps) {
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
    <div className="h-72 w-full" id="emission-pie-chart">
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any) => [`${Number(value).toFixed(2)} kg CO₂`, '']) as any}
            contentStyle={{
              background: '#171717',
              border: '1px solid #222',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#ededed',
            }}
            itemStyle={{ color: '#a1a1a1' }}
            labelStyle={{ color: '#ededed', fontWeight: 500 }}
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
}
