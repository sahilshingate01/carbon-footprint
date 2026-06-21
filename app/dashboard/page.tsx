'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Calculator, Trash2, Upload, Download } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { getRecentEntries, getMonthlyAggregates } from '@/lib/storage';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import EcoScoreRing from '@/components/EcoScoreRing';
import DashboardStats from '@/components/DashboardStats';
import RecentEntriesTable from '@/components/RecentEntriesTable';
import StorageWarning from '@/components/StorageWarning';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import GoalTracker from '@/components/GoalTracker';
import { exportToPDF } from '@/lib/export';

const EmissionTrendChart = dynamic(() => import('@/components/EmissionTrendChart'), { ssr: false });
const MonthlyBarChart = dynamic(() => import('@/components/MonthlyBarChart'), { ssr: false });
const EmissionPieChart = dynamic(() => import('@/components/EmissionPieChart'), { ssr: false });

/**
 * DashboardPage renders the user's dashboard with emission summaries, trends, and charts.
 */
export default function DashboardPage() {
  const { data, quota, isLoading, clearData, importData, exportData, updateData } = useUserData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const entries = useMemo(() => (data ? getRecentEntries(data, 20) : []), [data]);
  const monthlyData = useMemo(() => (data ? getMonthlyAggregates(data) : []), [data]);

  const historicalMessage = useMemo(() => {
    if (!data || data.entries.length < 2) return null;
    const firstVal = data.entries[0].emissions.total;
    const latestVal = data.entries[data.entries.length - 1].emissions.total;
    if (firstVal === 0) return null;
    const diffPct = ((firstVal - latestVal) / firstVal) * 100;
    if (diffPct > 0) {
      return `Your emissions decreased ${diffPct.toFixed(0)}% compared to your first entry! 🎉`;
    } else if (diffPct < 0) {
      return `Your emissions increased ${Math.abs(diffPct).toFixed(0)}% compared to your first entry. Keep taking action to lower your footprint!`;
    }
    return `Your emissions are stable compared to your first entry.`;
  }, [data]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      const result = importData(content);
      if (result.success) {
        setNotification({ message: "Data imported successfully!", type: "success" });
      } else {
        setNotification({ message: result.error || "Failed to import data.", type: "error" });
      }
      setTimeout(() => {
        setNotification(null);
      }, 5000);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all your carbon footprint data? This action cannot be undone.")) {
      clearData();
    }
  };

  const latest = useMemo(() => (entries.length > 0 ? entries[entries.length - 1] : null), [entries]);
  const previous = useMemo(() => (entries.length > 1 ? entries[entries.length - 2] : null), [entries]);
  
  const totalEntries = useMemo(() => (data ? data.entries.length : 0), [data]);
  
  const avgScore = useMemo(() => {
    return data && totalEntries > 0
      ? Math.round(data.entries.reduce((s, e) => s + e.ecoScore.score, 0) / totalEntries)
      : 0;
  }, [data, totalEntries]);

  const totalEmissions = useMemo(() => {
    return data ? data.entries.reduce((s, e) => s + e.emissions.total, 0) : 0;
  }, [data]);

  const completedSuggestionsCount = useMemo(() => {
    return data?.completedSuggestions?.length || 0;
  }, [data]);

  const handleUpdateGoal = (goal: number | null) => {
    updateData((prev) => ({ ...prev, weeklyGoal: goal }));
  };

  const trend = useMemo(() => {
    return previous && latest
      ? latest.emissions.total < previous.emissions.total
        ? 'down'
        : latest.emissions.total > previous.emissions.total
          ? 'up'
          : 'neutral'
      : 'neutral';
  }, [latest, previous]);

  const trendDiff = useMemo(() => {
    return previous && latest
      ? Math.abs(latest.emissions.total - previous.emissions.total).toFixed(1)
      : '0';
  }, [latest, previous]);

  if (isLoading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Storage Limit Warning */}
      <StorageWarning quota={quota} />

      {/* Notification Toast */}
      {notification && (
        <div 
          className={`mb-6 flex items-center justify-between gap-3 rounded-lg border p-4 text-sm animate-fade-in ${
            notification.type === 'success' 
              ? 'border-eco-a/20 bg-eco-a/5 text-eco-a' 
              : 'border-error/20 bg-error/5 text-error'
          }`}
          role="status"
          aria-live="polite"
        >
          <span className="font-medium">{notification.message}</span>
          <button 
            type="button" 
            onClick={() => setNotification(null)}
            className="text-xs font-semibold text-mute hover:text-ink transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-brand-blue">Dashboard</span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Emissions Overview
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
            id="import-data-file-input"
            aria-label="Import data JSON file"
          />
          <button
            type="button"
            onClick={handleImportClick}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3.5 text-sm text-mute transition-colors hover:text-ink hover:border-hairline-strong"
            title="Import Data"
            aria-label="Import Data from JSON"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Import</span>
          </button>
          <button
            type="button"
            onClick={exportData}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3.5 text-sm text-mute transition-colors hover:text-ink hover:border-hairline-strong"
            title="Export Data"
            aria-label="Export Data to JSON"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
          <button
            type="button"
            onClick={exportToPDF}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3.5 text-sm text-mute transition-colors hover:text-ink hover:border-hairline-strong no-print"
            title="Print PDF Report"
            aria-label="Print PDF Report"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleClearData}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3 text-sm text-mute transition-colors hover:text-error hover:border-error/30"
            title="Clear all data"
            aria-label="Clear all data"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <Link
            href="/calculator"
            prefetch={true}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-ink/80"
          >
            <Calculator className="h-3.5 w-3.5" />
            New Entry
          </Link>
        </div>
      </div>

      {historicalMessage && (
        <div className="mb-6 rounded-lg bg-brand-blue/10 border border-brand-blue/20 p-4 text-sm text-brand-blue animate-fade-in flex items-center gap-2">
          <span>🌟</span>
          <span className="font-medium">{historicalMessage}</span>
        </div>
      )}

      {!data || data.entries.length === 0 ? (
        <div className="card-elevated rounded-xl">
          <EmptyState
            title="No data yet"
            description="Calculate your carbon footprint or import an existing data backup to start seeing trends, charts, and insights here."
            icon={<Calculator className="h-7 w-7 text-mute" />}
          />
          <div className="flex justify-center pb-8">
            <Link
              href="/calculator"
              prefetch={true}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition-all hover:bg-ink/80"
            >
              <Calculator className="h-3.5 w-3.5" />
              Calculate Now
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Top stats */}
          <DashboardStats
            latestEmissionsTotal={latest?.emissions.total}
            trend={trend}
            trendDiff={trendDiff}
            avgScore={avgScore}
            totalEmissions={totalEmissions}
            completedSuggestionsCount={completedSuggestionsCount}
            totalEntries={totalEntries}
          />

          {/* Eco score + latest breakdown */}
          <div className="grid gap-5 lg:grid-cols-3 mb-8">
            {latest && (
              <div className="flex flex-col gap-5 lg:col-span-1">
                <div className="card-elevated rounded-xl p-6 flex flex-col items-center justify-center animate-scale-in">
                  <EcoScoreRing ecoScore={latest.ecoScore} size={160} />
                  <p className="mt-3 text-sm text-body text-center">Latest eco-score</p>
                </div>
                <GoalTracker
                  weeklyGoal={data.weeklyGoal}
                  latestEmissions={latest.emissions.total}
                  onUpdateGoal={handleUpdateGoal}
                />
              </div>
            )}
            <div className={`card-elevated rounded-xl p-6 animate-slide-up ${latest ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <h2 className="text-base font-semibold text-ink tracking-tight mb-2">Weekly Trend</h2>
              <p className="text-xs text-mute mb-4">Total emissions per week over time</p>
              <Suspense fallback={<div className="h-72 w-full animate-pulse bg-surface-3 rounded-lg" />}>
                <EmissionTrendChart entries={entries} />
              </Suspense>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid gap-5 lg:grid-cols-2 mb-8">
            {latest && (
              <div className="card-elevated rounded-xl p-6 animate-slide-up">
                <h2 className="text-base font-semibold text-ink tracking-tight mb-2">Latest Breakdown</h2>
                <p className="text-xs text-mute mb-4">Emissions by category for your most recent entry</p>
                <Suspense fallback={<div className="h-72 w-full animate-pulse bg-surface-3 rounded-lg" />}>
                  <EmissionPieChart emissions={latest.emissions} />
                </Suspense>
              </div>
            )}
            <div className="card-elevated rounded-xl p-6 animate-slide-up" style={{ animationDelay: '80ms' }}>
              <h2 className="text-base font-semibold text-ink tracking-tight mb-2">Monthly Comparison</h2>
              <p className="text-xs text-mute mb-4">Stacked emissions by category per month</p>
              <Suspense fallback={<div className="h-72 w-full animate-pulse bg-surface-3 rounded-lg" />}>
                <MonthlyBarChart data={monthlyData} />
              </Suspense>
            </div>
          </div>

          {/* Recent entries table */}
          <RecentEntriesTable entries={entries} />
        </>
      )}
    </div>
  );
}
