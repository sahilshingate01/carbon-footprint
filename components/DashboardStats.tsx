'use client';

import { Flame, TrendingDown, Zap, Award } from 'lucide-react';
import StatCard from '@/components/StatCard';

interface DashboardStatsProps {
  latestEmissionsTotal: number | null | undefined;
  trend: 'up' | 'down' | 'neutral';
  trendDiff: string;
  avgScore: number;
  totalEmissions: number;
  completedSuggestionsCount: number;
  totalEntries: number;
}

/**
 * DashboardStats renders the 5 top-level statistic cards for the user dashboard.
 */
export default function DashboardStats({
  latestEmissionsTotal,
  trend,
  trendDiff,
  avgScore,
  totalEmissions,
  completedSuggestionsCount,
  totalEntries,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
      {latestEmissionsTotal !== null && latestEmissionsTotal !== undefined && (
        <StatCard
          label="Latest Weekly"
          value={latestEmissionsTotal.toFixed(1)}
          unit="kg CO₂"
          icon={<Flame className="h-4 w-4" />}
          trend={trend}
          trendValue={`${trendDiff} kg vs last`}
        />
      )}
      <StatCard
        label="Avg Eco Score"
        value={avgScore.toString()}
        unit="/100"
        icon={<TrendingDown className="h-4 w-4" />}
      />
      <StatCard
        label="Total Tracked"
        value={totalEmissions.toFixed(0)}
        unit="kg CO₂"
        icon={<Zap className="h-4 w-4" />}
      />
      <StatCard
        label="AI Actions"
        value={completedSuggestionsCount.toString()}
        unit="completed"
        icon={<Award className="h-4 w-4" />}
      />
      <StatCard
        label="Entries"
        value={totalEntries.toString()}
        unit="weeks"
      />
    </div>
  );
}
