'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Bike, Bus, Zap, Utensils, ArrowRight, Check, RotateCcw } from 'lucide-react';
import type { CalculatorInputs, DietType, EmissionBreakdown, EcoScore } from '@/types';
import { TRANSPORT_MODES, DIET_TYPES } from '@/lib/constants';
import { calculateEmissions, calculateEcoScore, annualizeEmissions, getPercentageBreakdown } from '@/lib/calculations';
import { generateSuggestions, generateReductionPlan } from '@/lib/suggestions';
import { useUserData } from '@/hooks/useUserData';
import EcoScoreRing from '@/components/EcoScoreRing';
import EmissionPieChart from '@/components/EmissionPieChart';
import SuggestionCard, { AIInsightsBanner } from '@/components/SuggestionCard';
import ReductionPlan from '@/components/ReductionPlan';
import StatCard from '@/components/StatCard';

const transportIcons: Record<string, React.ReactNode> = {
  car: <Car className="h-5 w-5" />,
  bike: <Bike className="h-5 w-5" />,
  public: <Bus className="h-5 w-5" />,
};

export default function CalculatorPage() {
  const router = useRouter();
  const { addEntry } = useUserData();

  const [step, setStep] = useState<'input' | 'results'>('input');
  const [inputs, setInputs] = useState<CalculatorInputs>({
    transport: { mode: 'car', distancePerWeek: 100 },
    energy: { monthlyElectricity: 250 },
    diet: { type: 'mixed' },
  });
  const [results, setResults] = useState<{
    emissions: EmissionBreakdown;
    ecoScore: EcoScore;
  } | null>(null);

  const handleCalculate = useCallback(() => {
    const emissions = calculateEmissions(inputs);
    const ecoScore = calculateEcoScore(emissions);
    addEntry(inputs, emissions, ecoScore);
    setResults({ emissions, ecoScore });
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [inputs, addEntry]);

  const handleReset = () => {
    setStep('input');
    setResults(null);
    setInputs({
      transport: { mode: 'car', distancePerWeek: 100 },
      energy: { monthlyElectricity: 250 },
      diet: { type: 'mixed' },
    });
  };

  if (step === 'results' && results) {
    const suggestions = generateSuggestions(inputs, results.emissions);
    const totalSavings = suggestions.reduce((s, sg) => s + sg.savingsKg, 0);
    const plan = generateReductionPlan(inputs);
    const breakdown = getPercentageBreakdown(results.emissions);
    const annual = annualizeEmissions(results.emissions.total);

    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-brand-blue">Results</span>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Your Carbon Footprint</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleReset} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-4 text-sm text-body transition-colors hover:text-ink hover:border-hairline-strong">
              <RotateCcw className="h-3.5 w-3.5" /> Recalculate
            </button>
            <button type="button" onClick={() => router.push('/dashboard')} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-surface-0 transition-colors hover:bg-white">
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

        {/* Charts */}
        <div className="grid gap-5 lg:grid-cols-2 mb-8">
          <div className="card-elevated rounded-xl p-6 animate-slide-up">
            <h2 className="text-base font-semibold text-ink tracking-tight mb-4">Emission Breakdown</h2>
            <EmissionPieChart emissions={results.emissions} />
          </div>
          <div className="card-elevated rounded-xl p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <AIInsightsBanner totalSavings={totalSavings} />
            <div className="mt-5 space-y-3">
              {suggestions.slice(0, 4).map((s, i) => (
                <SuggestionCard key={s.id} suggestion={s} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* All suggestions */}
        {suggestions.length > 4 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-ink tracking-tight mb-4">More Suggestions</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {suggestions.slice(4).map((s, i) => (
                <SuggestionCard key={s.id} suggestion={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Reduction Plan */}
        <div className="card-elevated rounded-xl p-6 animate-slide-up">
          <ReductionPlan plan={plan} />
        </div>
      </div>
    );
  }

  // Input form
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center mb-10 animate-fade-in">
        <span className="font-mono text-xs uppercase tracking-wider text-brand-blue">Calculator</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-1.28px] text-ink sm:text-4xl">
          Calculate your footprint.
        </h1>
        <p className="mt-3 text-base text-body">
          Answer three simple questions to get your personalized carbon report.
        </p>
      </div>

      <div className="space-y-8">
        {/* Transport */}
        <div className="card-elevated rounded-xl p-6 animate-slide-up" id="input-transport">
          <div className="flex items-center gap-2 mb-5">
            <Car className="h-4 w-4 text-cat-transport" />
            <h2 className="text-base font-semibold text-ink tracking-tight">Transportation</h2>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {TRANSPORT_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setInputs({ ...inputs, transport: { ...inputs.transport, mode: mode.value } })}
                className={`relative flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all duration-200 ${
                  inputs.transport.mode === mode.value
                    ? 'border-brand-blue bg-brand-blue/5 text-ink'
                    : 'border-hairline bg-surface-2 text-body hover:border-hairline-strong hover:text-ink'
                }`}
              >
                {inputs.transport.mode === mode.value && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-3.5 w-3.5 text-brand-blue" />
                  </div>
                )}
                <div className="text-xl">{transportIcons[mode.value]}</div>
                <span className="text-sm font-medium">{mode.label}</span>
                <span className="text-[11px] text-mute">{mode.description}</span>
              </button>
            ))}
          </div>

          <label htmlFor="distance" className="block text-sm text-body mb-2">
            Distance traveled per week (km)
          </label>
          <input
            id="distance"
            type="number"
            min={0}
            max={2000}
            value={inputs.transport.distancePerWeek}
            onChange={(e) =>
              setInputs({
                ...inputs,
                transport: { ...inputs.transport, distancePerWeek: Math.max(0, Number(e.target.value)) },
              })
            }
            className="w-full h-10 rounded-md border border-hairline bg-surface-2 px-3 text-sm text-ink outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30"
          />
        </div>

        {/* Energy */}
        <div className="card-elevated rounded-xl p-6 animate-slide-up" style={{ animationDelay: '80ms' }} id="input-energy">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-cat-energy" />
            <h2 className="text-base font-semibold text-ink tracking-tight">Energy</h2>
          </div>
          <label htmlFor="electricity" className="block text-sm text-body mb-2">
            Monthly electricity consumption (kWh)
          </label>
          <input
            id="electricity"
            type="number"
            min={0}
            max={5000}
            value={inputs.energy.monthlyElectricity}
            onChange={(e) =>
              setInputs({
                ...inputs,
                energy: { monthlyElectricity: Math.max(0, Number(e.target.value)) },
              })
            }
            className="w-full h-10 rounded-md border border-hairline bg-surface-2 px-3 text-sm text-ink outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30"
          />
          <p className="mt-2 text-xs text-mute">Average household: 200–300 kWh/month</p>
        </div>

        {/* Diet */}
        <div className="card-elevated rounded-xl p-6 animate-slide-up" style={{ animationDelay: '160ms' }} id="input-diet">
          <div className="flex items-center gap-2 mb-5">
            <Utensils className="h-4 w-4 text-cat-diet" />
            <h2 className="text-base font-semibold text-ink tracking-tight">Diet</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DIET_TYPES.map((diet) => (
              <button
                key={diet.value}
                type="button"
                onClick={() => setInputs({ ...inputs, diet: { type: diet.value as DietType } })}
                className={`relative flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all duration-200 ${
                  inputs.diet.type === diet.value
                    ? 'border-brand-pink bg-brand-pink/5 text-ink'
                    : 'border-hairline bg-surface-2 text-body hover:border-hairline-strong hover:text-ink'
                }`}
              >
                {inputs.diet.type === diet.value && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-3.5 w-3.5 text-brand-pink" />
                  </div>
                )}
                <span className="text-xl">{diet.icon}</span>
                <span className="text-sm font-medium">{diet.label}</span>
                <span className="text-[11px] text-mute">{diet.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleCalculate}
          id="calculate-button"
          className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-medium text-surface-0 transition-all hover:bg-white hover:scale-[1.01] active:scale-[0.99] animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          Calculate My Footprint
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
