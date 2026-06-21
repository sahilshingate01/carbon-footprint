import { memo } from 'react';

interface StatCardProps {
  /**
   * The short name or description of the statistic.
   */
  label: string;
  /**
   * The primary metric value (rendered in large text).
   */
  value: string;
  /**
   * The measurement unit (e.g. "kg CO₂").
   */
  unit?: string;
  /**
   * Optional icon to render in the card's top right corner.
   */
  icon?: React.ReactNode;
  /**
   * Optional trend direction relative to previous calculations.
   */
  trend?: 'up' | 'down' | 'neutral';
  /**
   * Text context summarizing the trend difference.
   */
  trendValue?: string;
  /**
   * Optional CSS overrides.
   */
  className?: string;
}

/**
 * StatCard displays a single highlight statistic in an elevated container.
 * Features optional semantic coloring based on trend direction.
 */
const StatCard = memo(function StatCard({ label, value, unit, icon, trend, trendValue, className = '' }: StatCardProps) {
  const trendColor = trend === 'down' ? 'text-eco-a' : trend === 'up' ? 'text-error' : 'text-mute';

  return (
    <div className={`card-elevated rounded-xl p-5 ${className}`} id={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-mute">{label}</span>
        {icon && <div className="text-mute">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold text-ink tracking-tight">{value}</span>
        {unit && <span className="text-sm text-mute">{unit}</span>}
      </div>
      {trend && trendValue && (
        <p className={`mt-2 text-xs font-medium ${trendColor}`}>
          {trend === 'down' ? '↓' : trend === 'up' ? '↑' : '→'} {trendValue}
        </p>
      )}
    </div>
  );
});

export default StatCard;
