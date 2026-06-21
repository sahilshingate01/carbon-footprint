import type { TooltipProps } from 'recharts';

/**
 * Shared styling configuration for Recharts Tooltips to maintain visual consistency.
 */
export const SHARED_TOOLTIP_STYLE = {
  contentStyle: {
    background: '#ffffff',
    border: '1px solid #e5e5df',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#1a1a1a',
  },
  itemStyle: { color: '#4a4a4a' },
  labelStyle: { color: '#1a1a1a', fontWeight: 500 },
};

/**
 * Type helper matching the Tooltip component's formatter signature.
 */
export type ChartTooltipFormatter = TooltipProps<
  number | string | readonly (number | string)[],
  number | string
>['formatter'];

/**
 * Format numeric emission values for general trend and comparison charts.
 */
export const formatEmissions: ChartTooltipFormatter = (value) => {
  return [`${Number(value).toFixed(2)} kg CO₂`];
};

/**
 * Format numeric emission values for pie breakdown chart (excluding series name).
 */
export const formatPieEmissions: ChartTooltipFormatter = (value) => {
  return [`${Number(value).toFixed(2)} kg CO₂`, ''];
};
