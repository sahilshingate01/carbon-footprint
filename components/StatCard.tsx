interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export default function StatCard({ label, value, unit, icon, trend, trendValue, className = '' }: StatCardProps) {
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
}
