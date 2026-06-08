'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Calculator, TrendingDown, Zap, Flame, Trash2 } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { getRecentEntries, getMonthlyAggregates } from '@/lib/storage';
import LoadingState, { EmptyState } from '@/components/LoadingState';
import StatCard from '@/components/StatCard';
import EcoScoreRing from '@/components/EcoScoreRing';
import EmissionTrendChart from '@/components/EmissionTrendChart';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import EmissionPieChart from '@/components/EmissionPieChart';

export default function DashboardPage() {
  const { data, isLoading, clearData } = useUserData();

  const entries = useMemo(() => (data ? getRecentEntries(20) : []), [data]);
  const monthlyData = useMemo(() => (data ? getMonthlyAggregates() : []), [data]);

  if (isLoading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  if (!data || data.entries.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="text-center mb-10 animate-fade-in">
          <span className="font-mono text-xs uppercase tracking-wider text-brand-blue">Dashboard</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-1.28px] text-ink sm:text-4xl">
            Your emission tracker.
          </h1>
        </div>
        <div className="card-elevated rounded-xl">
          <EmptyState
            title="No data yet"
            description="Calculate your carbon footprint to start seeing trends, charts, and insights here."
            icon={<Calculator className="h-7 w-7 text-mute" />}
          />
          <div className="flex justify-center pb-8">
            <Link
              href="/calculator"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-surface-0 transition-all hover:bg-white"
            >
              <Calculator className="h-3.5 w-3.5" />
              Calculate Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const latest = entries[entries.length - 1];
  const previous = entries.length > 1 ? entries[entries.length - 2] : null;
  const totalEntries = data.entries.length;
  const avgScore = Math.round(data.entries.reduce((s, e) => s + e.ecoScore.score, 0) / totalEntries);
  const totalEmissions = data.entries.reduce((s, e) => s + e.emissions.total, 0);

  const trend = previous
    ? latest.emissions.total < previous.emissions.total
      ? 'down'
      : latest.emissions.total > previous.emissions.total
        ? 'up'
        : 'neutral'
    : 'neutral';

  const trendDiff = previous
    ? Math.abs(latest.emissions.total - previous.emissions.total).toFixed(1)
    : '0';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-brand-blue">Dashboard</span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Emissions Overview
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clearData}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3 text-sm text-mute transition-colors hover:text-error hover:border-error/30"
            title="Clear all data"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <Link
            href="/calculator"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-surface-0 transition-colors hover:bg-white"
          >
            <Calculator className="h-3.5 w-3.5" />
            New Entry
          </Link>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          label="Latest Weekly"
          value={latest.emissions.total.toFixed(1)}
          unit="kg CO₂"
          icon={<Flame className="h-4 w-4" />}
          trend={trend as 'up' | 'down' | 'neutral'}
          trendValue={`${trendDiff} kg vs last`}
        />
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
          label="Entries"
          value={totalEntries.toString()}
          unit="weeks"
        />
      </div>

      {/* Eco score + latest breakdown */}
      <div className="grid gap-5 lg:grid-cols-3 mb-8">
        <div className="card-elevated rounded-xl p-6 flex flex-col items-center justify-center animate-scale-in">
          <EcoScoreRing ecoScore={latest.ecoScore} size={160} />
          <p className="mt-3 text-sm text-body text-center">Latest eco-score</p>
        </div>
        <div className="card-elevated rounded-xl p-6 lg:col-span-2 animate-slide-up">
          <h2 className="text-base font-semibold text-ink tracking-tight mb-2">Weekly Trend</h2>
          <p className="text-xs text-mute mb-4">Total emissions per week over time</p>
          <EmissionTrendChart entries={entries} />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-2 mb-8">
        <div className="card-elevated rounded-xl p-6 animate-slide-up">
          <h2 className="text-base font-semibold text-ink tracking-tight mb-2">Latest Breakdown</h2>
          <p className="text-xs text-mute mb-4">Emissions by category for your most recent entry</p>
          <EmissionPieChart emissions={latest.emissions} />
        </div>
        <div className="card-elevated rounded-xl p-6 animate-slide-up" style={{ animationDelay: '80ms' }}>
          <h2 className="text-base font-semibold text-ink tracking-tight mb-2">Monthly Comparison</h2>
          <p className="text-xs text-mute mb-4">Stacked emissions by category per month</p>
          <MonthlyBarChart data={monthlyData} />
        </div>
      </div>

      {/* Recent entries table */}
      <div className="card-elevated rounded-xl p-6 animate-slide-up" style={{ animationDelay: '160ms' }}>
        <h2 className="text-base font-semibold text-ink tracking-tight mb-4">Recent Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="pb-3 text-left font-mono text-xs uppercase tracking-wider text-mute">Date</th>
                <th className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Transport</th>
                <th className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Energy</th>
                <th className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Diet</th>
                <th className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Total</th>
                <th className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Score</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice().reverse().map((entry) => (
                <tr key={entry.id} className="border-b border-hairline/50 last:border-0">
                  <td className="py-3 text-body">
                    {new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 text-right text-body">{entry.emissions.transport.toFixed(1)}</td>
                  <td className="py-3 text-right text-body">{entry.emissions.energy.toFixed(1)}</td>
                  <td className="py-3 text-right text-body">{entry.emissions.diet.toFixed(1)}</td>
                  <td className="py-3 text-right font-medium text-ink">{entry.emissions.total.toFixed(1)}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center justify-center h-6 w-8 rounded text-xs font-semibold ${
                      entry.ecoScore.score >= 80 ? 'bg-eco-a/10 text-eco-a' :
                      entry.ecoScore.score >= 60 ? 'bg-eco-b/10 text-eco-b' :
                      entry.ecoScore.score >= 40 ? 'bg-eco-c/10 text-eco-c' :
                      entry.ecoScore.score >= 20 ? 'bg-eco-d/10 text-eco-d' :
                      'bg-eco-f/10 text-eco-f'
                    }`}>
                      {entry.ecoScore.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
