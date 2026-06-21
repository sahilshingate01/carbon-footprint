'use client';

import { useMemo, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, ArrowRight, Zap } from 'lucide-react';
import type { CalculatorInputs, EmissionBreakdown, EcoScore, UserData } from '@/types';
import type { StorageUsage } from '@/lib/storage';
import { annualizeEmissions, getPercentageBreakdown } from '@/lib/calculations';
import { generateSuggestions, generateReductionPlan } from '@/lib/suggestions';
import { getCarbonEquivalents } from '@/lib/equivalencies';
import EcoScoreRing from '@/components/EcoScoreRing';
import StatCard from '@/components/StatCard';
import SuggestionCard, { AIInsightsBanner } from '@/components/SuggestionCard';
import ReductionPlan from '@/components/ReductionPlan';
import RegionalComparison from '@/components/RegionalComparison';
import StorageWarning from '@/components/StorageWarning';
import dynamic from 'next/dynamic';

const EmissionPieChart = dynamic(() => import('@/components/EmissionPieChart'), { ssr: false });

interface CalculatorResultsProps {
  /**
   * The inputs entered by the user.
   */
  inputs: CalculatorInputs;
  /**
   * The calculated emissions and score results.
   */
  results: {
    emissions: EmissionBreakdown;
    ecoScore: EcoScore;
  };
  /**
   * Browser localStorage quota status.
   */
  quota: StorageUsage | null;
  /**
   * Callback to reset calculations and return to form view.
   */
  onReset: () => void;
  /**
   * List of completed suggestions ids.
   */
  completedSuggestions?: string[];
  /**
   * List of completed days in the reduction plan.
   */
  completedPlanDays?: number[];
  /**
   * Callback to update user data.
   */
  updateData: (updater: (prev: UserData) => UserData) => void;
}

/**
 * CalculatorResults renders the detailed report for the calculated carbon emissions.
 */
export default function CalculatorResults({
  inputs,
  results,
  quota,
  onReset,
  completedSuggestions = [],
  completedPlanDays = [],
  updateData,
}: CalculatorResultsProps) {
  const router = useRouter();

  const suggestions = useMemo(() => {
    return generateSuggestions(inputs, results.emissions);
  }, [results, inputs]);

  const totalSavings = useMemo(() => {
    return suggestions.reduce((s, sg) => s + sg.savingsKg, 0);
  }, [suggestions]);

  const plan = useMemo(() => {
    return generateReductionPlan(inputs);
  }, [inputs]);

  const breakdown = useMemo(() => {
    return getPercentageBreakdown(results.emissions);
  }, [results]);

  const annual = useMemo(() => {
    return annualizeEmissions(results.emissions.total);
  }, [results]);

  const equivalents = useMemo(() => {
    return getCarbonEquivalents(results.emissions.total);
  }, [results]);

  const toggleSuggestion = useCallback((suggestionId: string) => {
    updateData((prev) => {
      const list = prev.completedSuggestions || [];
      const nextList = list.includes(suggestionId)
        ? list.filter((id) => id !== suggestionId)
        : [...list, suggestionId];
      return { ...prev, completedSuggestions: nextList };
    });
  }, [updateData]);

  const togglePlanDay = useCallback((day: number) => {
    updateData((prev) => {
      const list = prev.completedPlanDays || [];
      const nextList = list.includes(day)
        ? list.filter((d) => d !== day)
        : [...list, day];
      return { ...prev, completedPlanDays: nextList };
    });
  }, [updateData]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16" id="calculator-results">
      {/* Storage Limit Warning */}
      <StorageWarning quota={quota} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-brand-blue">Results</span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Your Carbon Footprint</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            aria-label="Recalculate your carbon footprint"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-4 text-sm text-body transition-colors hover:text-ink hover:border-hairline-strong"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Recalculate
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            aria-label="Go to emissions dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-ink/80"
          >
            Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Score + Stats */}
      <div className="grid gap-5 lg:grid-cols-3 mb-8">
        <div className="card-elevated rounded-xl p-6 flex flex-col items-center justify-center lg:row-span-2 animate-scale-in">
          <EcoScoreRing ecoScore={results.ecoScore} size={200} />
          <p className="mt-4 text-sm text-body text-center max-w-xs">
            Your eco-score is graded <span className="font-semibold text-ink">{results.ecoScore.grade}</span> — {results.ecoScore.label.toLowerCase()}.
          </p>
        </div>
        <StatCard label="Weekly Emissions" value={results.emissions.total.toFixed(1)} unit="kg CO₂" icon={<Zap className="h-4 w-4" />} />
        <StatCard label="Annual Estimate" value={(annual / 1000).toFixed(1)} unit="tonnes CO₂" />
        <StatCard label="Transport" value={`${breakdown.transport}%`} trendValue={`${results.emissions.transport.toFixed(1)} kg`} trend="neutral" />
        <StatCard label="Energy" value={`${breakdown.energy}%`} trendValue={`${results.emissions.energy.toFixed(1)} kg`} trend="neutral" />
      </div>

      {/* Carbon Equivalencies */}
      <div className="card-elevated rounded-xl p-6 mb-8 animate-slide-up">
        <h2 className="text-base font-semibold text-ink tracking-tight mb-4">What does this emission level mean?</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <div className="card-soft rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">🌳</div>
            <div className="text-lg font-semibold text-ink">{equivalents.treesYear.toFixed(1)}</div>
            <div className="text-xs text-mute">Mature tree-years to offset</div>
          </div>
          <div className="card-soft rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">🚗</div>
            <div className="text-lg font-semibold text-ink">{Math.round(equivalents.drivingKm)} km</div>
            <div className="text-xs text-mute">Driving a gasoline car</div>
          </div>
          <div className="card-soft rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">✈️</div>
            <div className="text-lg font-semibold text-ink">{Math.round(equivalents.flightKm)} km</div>
            <div className="text-xs text-mute">Commercial flight distance</div>
          </div>
          <div className="card-soft rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">💡</div>
            <div className="text-lg font-semibold text-ink">{Math.round(equivalents.lightbulbHours).toLocaleString()} hrs</div>
            <div className="text-xs text-mute">60W lightbulb run time</div>
          </div>
        </div>
      </div>

      {/* Charts and Regional Comparison */}
      <div className="grid gap-5 lg:grid-cols-2 mb-8">
        <div className="card-elevated rounded-xl p-6 animate-slide-up">
          <h2 className="text-base font-semibold text-ink tracking-tight mb-4">Emission Breakdown</h2>
          <Suspense fallback={<div className="h-72 w-full animate-pulse bg-surface-3 rounded-lg" />}>
            <EmissionPieChart emissions={results.emissions} />
          </Suspense>
        </div>

        <RegionalComparison annual={annual} />
      </div>

      {/* AI Recommendations */}
      <div className="card-elevated rounded-xl p-6 animate-slide-up mb-8" style={{ animationDelay: '100ms' }}>
        <AIInsightsBanner totalSavings={totalSavings} />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {suggestions.slice(0, 4).map((s, i) => (
            <SuggestionCard
              key={s.id}
              suggestion={s}
              index={i}
              isCompleted={completedSuggestions.includes(s.id)}
              onToggleComplete={() => toggleSuggestion(s.id)}
            />
          ))}
        </div>
      </div>

      {/* More suggestions */}
      {suggestions.length > 4 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-ink tracking-tight mb-4">More Suggestions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestions.slice(4).map((s, i) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                index={i}
                isCompleted={completedSuggestions.includes(s.id)}
                onToggleComplete={() => toggleSuggestion(s.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reduction Plan */}
      <div className="card-elevated rounded-xl p-6 animate-slide-up">
        <ReductionPlan
          plan={plan}
          completedDays={completedPlanDays}
          onToggleDay={togglePlanDay}
        />
      </div>
    </div>
  );
}
