'use client';

import { useState, useCallback, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Bike, Bus, Zap, Utensils, ArrowRight, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import type { CalculatorInputs, DietType, EmissionBreakdown, EcoScore } from '@/types';
import { TRANSPORT_MODES, DIET_TYPES, COUNTRY_AVERAGES } from '@/lib/constants';
import { calculateEmissions, calculateEcoScore, annualizeEmissions, getPercentageBreakdown } from '@/lib/calculations';
import { generateSuggestions, generateReductionPlan } from '@/lib/suggestions';
import { useUserData } from '@/hooks/useUserData';
import { validateCalculatorInputs, sanitizeCalculatorInputs } from '@/lib/validation';
import EcoScoreRing from '@/components/EcoScoreRing';
import dynamic from 'next/dynamic';
import SuggestionCard, { AIInsightsBanner } from '@/components/SuggestionCard';
import ReductionPlan from '@/components/ReductionPlan';
import StatCard from '@/components/StatCard';
import { getCarbonEquivalents } from '@/lib/equivalencies';

const EmissionPieChart = dynamic(() => import('@/components/EmissionPieChart'), { ssr: false });

const transportIcons: Record<string, React.ReactNode> = {
  car: <Car className="h-5 w-5" />,
  bike: <Bike className="h-5 w-5" />,
  public: <Bus className="h-5 w-5" />,
};

export default function CalculatorPage() {
  const router = useRouter();
  const { quota, addEntry, data, updateData } = useUserData();

  const [step, setStep] = useState<'input' | 'results'>('input');
  const [selectedCountryCode, setSelectedCountryCode] = useState('GL');
  const [inputs, setInputs] = useState<CalculatorInputs>({
    transport: { mode: 'car', distancePerWeek: 100 },
    energy: { monthlyElectricity: 250 },
    diet: { type: 'mixed' },
  });
  const [results, setResults] = useState<{
    emissions: EmissionBreakdown;
    ecoScore: EcoScore;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const suggestions = useMemo(() => {
    if (!results) return [];
    return generateSuggestions(inputs, results.emissions);
  }, [results, inputs]);

  const totalSavings = useMemo(() => {
    return suggestions.reduce((s, sg) => s + sg.savingsKg, 0);
  }, [suggestions]);

  const plan = useMemo(() => {
    if (!results) return [];
    return generateReductionPlan(inputs);
  }, [results, inputs]);

  const breakdown = useMemo(() => {
    if (!results) return { transport: 0, energy: 0, diet: 0 };
    return getPercentageBreakdown(results.emissions);
  }, [results]);

  const annual = useMemo(() => {
    if (!results) return 0;
    return annualizeEmissions(results.emissions.total);
  }, [results]);

  const equivalents = useMemo(() => {
    if (!results) return null;
    return getCarbonEquivalents(results.emissions.total);
  }, [results]);

  const selectedCountry = useMemo(() => {
    return COUNTRY_AVERAGES.find((c) => c.code === selectedCountryCode) || COUNTRY_AVERAGES[5];
  }, [selectedCountryCode]);

  const handleCalculate = useCallback(() => {
    const validation = validateCalculatorInputs(
      inputs.transport.mode,
      inputs.transport.distancePerWeek,
      inputs.energy.monthlyElectricity,
      inputs.diet.type
    );
    if (!validation.isValid) {
      const errMap: Record<string, string> = {};
      validation.errors.forEach((err) => {
        errMap[err.field] = err.message;
      });
      setValidationErrors(errMap);
      return;
    }
    setValidationErrors({});
    const sanitizedInputs = sanitizeCalculatorInputs(inputs);
    const emissions = calculateEmissions(sanitizedInputs);
    const ecoScore = calculateEcoScore(emissions);
    addEntry(sanitizedInputs, emissions, ecoScore);
    setResults({ emissions, ecoScore });
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [inputs, addEntry]);

  const handleReset = () => {
    setStep('input');
    setResults(null);
    setValidationErrors({});
    setInputs({
      transport: { mode: 'car', distancePerWeek: 100 },
      energy: { monthlyElectricity: 250 },
      diet: { type: 'mixed' },
    });
  };

  if (step === 'results' && results) {

    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Storage Limit Warning */}
        {quota?.isApproachingLimit && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-error/20 bg-error/5 p-4 text-sm text-error animate-fade-in">
            <AlertTriangle className="h-5 w-5 shrink-0 text-error" />
            <div>
              <span className="font-semibold text-ink">Storage Warning:</span> You are approaching your browser&apos;s storage limit ({quota.percentage}% used). Please consider exporting your data and clearing some entries to avoid data loss.
            </div>
          </div>
        )}
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
            <button type="button" onClick={() => router.push('/dashboard')} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-ink/80">
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
              <div className="text-lg font-semibold text-ink">{equivalents ? equivalents.treesYear.toFixed(1) : '0.0'}</div>
              <div className="text-xs text-mute">Mature tree-years to offset</div>
            </div>
            <div className="card-soft rounded-lg p-4 text-center">
              <div className="text-2xl mb-1">🚗</div>
              <div className="text-lg font-semibold text-ink">{equivalents ? Math.round(equivalents.drivingKm) : 0} km</div>
              <div className="text-xs text-mute">Driving a gasoline car</div>
            </div>
            <div className="card-soft rounded-lg p-4 text-center">
              <div className="text-2xl mb-1">✈️</div>
              <div className="text-lg font-semibold text-ink">{equivalents ? Math.round(equivalents.flightKm) : 0} km</div>
              <div className="text-xs text-mute">Commercial flight distance</div>
            </div>
            <div className="card-soft rounded-lg p-4 text-center">
              <div className="text-2xl mb-1">💡</div>
              <div className="text-lg font-semibold text-ink">{equivalents ? Math.round(equivalents.lightbulbHours).toLocaleString() : 0} hrs</div>
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
          
          <div className="card-elevated rounded-xl p-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
            <h2 className="text-base font-semibold text-ink tracking-tight mb-2">Regional Comparison</h2>
            <p className="text-xs text-mute mb-4">Compare your footprint against national averages per capita</p>
            <div className="mb-4">
              <label htmlFor="country-selector" className="sr-only">Select Country</label>
              <select
                id="country-selector"
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="h-9 w-full rounded-md border border-hairline bg-surface-2 px-3 text-sm text-ink outline-none focus:border-brand-blue"
              >
                {COUNTRY_AVERAGES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.annualPerCapita / 1000} tonnes/year)
                  </option>
                ))}
              </select>
            </div>
            
            {/* Visual comparison bar chart */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium text-ink mb-1">
                  <span>Your Footprint (Annualized)</span>
                  <span>{(annual / 1000).toFixed(1)} tonnes CO₂/yr</span>
                </div>
                <div className="h-4 w-full rounded bg-hairline overflow-hidden">
                  <div
                    className="h-full bg-brand-blue rounded"
                    style={{ width: `${Math.max(5, Math.min(100, (annual / Math.max(annual, selectedCountry.annualPerCapita)) * 100))}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-medium text-ink mb-1">
                  <span>{selectedCountry.name} Average per capita</span>
                  <span>{(selectedCountry.annualPerCapita / 1000).toFixed(1)} tonnes CO₂/yr</span>
                </div>
                <div className="h-4 w-full rounded bg-hairline overflow-hidden">
                  <div
                    className="h-full bg-mute rounded"
                    style={{ width: `${Math.max(5, Math.min(100, (selectedCountry.annualPerCapita / Math.max(annual, selectedCountry.annualPerCapita)) * 100))}%` }}
                  />
                </div>
              </div>
              
              <p className="text-xs text-body leading-relaxed pt-2">
                {annual < selectedCountry.annualPerCapita ? (
                  <span className="text-success font-medium">
                    🎉 Your carbon footprint is {Math.round(((selectedCountry.annualPerCapita - annual) / selectedCountry.annualPerCapita) * 100)}% lower than the average in {selectedCountry.name}!
                  </span>
                ) : annual > selectedCountry.annualPerCapita ? (
                  <span className="text-brand-pink font-medium">
                    Your carbon footprint is {Math.round(((annual - selectedCountry.annualPerCapita) / selectedCountry.annualPerCapita) * 100)}% higher than the average in {selectedCountry.name}. Check out the suggestions below to find ways to reduce.
                  </span>
                ) : (
                  <span>Your footprint matches the national average for {selectedCountry.name}.</span>
                )}
              </p>
            </div>
          </div>
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
                isCompleted={data?.completedSuggestions?.includes(s.id)}
                onToggleComplete={() => {
                  updateData((prev) => {
                    const list = prev.completedSuggestions || [];
                    const nextList = list.includes(s.id) ? list.filter((id) => id !== s.id) : [...list, s.id];
                    return { ...prev, completedSuggestions: nextList };
                  });
                }}
              />
            ))}
          </div>
        </div>

        {/* All suggestions */}
        {suggestions.length > 4 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-ink tracking-tight mb-4">More Suggestions</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {suggestions.slice(4).map((s, i) => (
                <SuggestionCard
                  key={s.id}
                  suggestion={s}
                  index={i}
                  isCompleted={data?.completedSuggestions?.includes(s.id)}
                  onToggleComplete={() => {
                    updateData((prev) => {
                      const list = prev.completedSuggestions || [];
                      const nextList = list.includes(s.id) ? list.filter((id) => id !== s.id) : [...list, s.id];
                      return { ...prev, completedSuggestions: nextList };
                    });
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reduction Plan */}
        <div className="card-elevated rounded-xl p-6 animate-slide-up">
          <ReductionPlan
            plan={plan}
            completedDays={data?.completedPlanDays}
            onToggleDay={(day) => {
              updateData((prev) => {
                const list = prev.completedPlanDays || [];
                const nextList = list.includes(day) ? list.filter((d) => d !== day) : [...list, day];
                return { ...prev, completedPlanDays: nextList };
              });
            }}
          />
        </div>
      </div>
    );
  }

  // Input form
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Storage Limit Warning */}
      {quota?.isApproachingLimit && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-error/20 bg-error/5 p-4 text-sm text-error animate-fade-in">
          <AlertTriangle className="h-5 w-5 shrink-0 text-error" />
          <div>
            <span className="font-semibold text-ink">Storage Warning:</span> You are approaching your browser&apos;s storage limit ({quota.percentage}% used). Please consider exporting your data and clearing some entries to avoid data loss.
          </div>
        </div>
      )}
      <div className="text-center mb-10 animate-fade-in">
        <span className="font-mono text-xs uppercase tracking-wider text-brand-blue">Calculator</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-1.28px] text-ink sm:text-4xl">
          Calculate your footprint.
        </h1>
        <p className="mt-3 text-base text-body">
          Answer three simple questions to get your personalized carbon report.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-8">
        {/* Transport */}
        <fieldset className="card-elevated rounded-xl p-6 animate-slide-up border-0" id="input-transport">
          <legend className="flex items-center gap-2 mb-5 text-base font-semibold text-ink tracking-tight w-full">
            <Car className="h-4 w-4 text-cat-transport" />
            <span>Transportation</span>
          </legend>

          <div className="grid grid-cols-3 gap-2 mb-5" role="radiogroup" aria-label="Transport Mode">
            {TRANSPORT_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                role="radio"
                aria-checked={inputs.transport.mode === mode.value}
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
            onChange={(e) => {
              const val = e.target.value === '' ? 0 : Number(e.target.value);
              setInputs({
                ...inputs,
                transport: { ...inputs.transport, distancePerWeek: val },
              });
              if (validationErrors.distance) {
                setValidationErrors((prev) => ({ ...prev, distance: '' }));
              }
            }}
            className={`w-full h-10 rounded-md border bg-surface-2 px-3 text-sm text-ink outline-none transition-colors focus:ring-1 ${
              validationErrors.distance
                ? 'border-error focus:border-error focus:ring-error/30'
                : 'border-hairline focus:border-brand-blue focus:ring-brand-blue/30'
            }`}
          />
          {validationErrors.distance && (
            <p className="mt-2 text-xs text-error font-medium">{validationErrors.distance}</p>
          )}
        </fieldset>

        {/* Energy */}
        <fieldset className="card-elevated rounded-xl p-6 animate-slide-up border-0" style={{ animationDelay: '80ms' }} id="input-energy">
          <legend className="flex items-center gap-2 mb-5 text-base font-semibold text-ink tracking-tight w-full">
            <Zap className="h-4 w-4 text-cat-energy" />
            <span>Energy</span>
          </legend>
          <label htmlFor="electricity" className="block text-sm text-body mb-2">
            Monthly electricity consumption (kWh)
          </label>
          <input
            id="electricity"
            type="number"
            min={0}
            max={5000}
            value={inputs.energy.monthlyElectricity}
            onChange={(e) => {
              const val = e.target.value === '' ? 0 : Number(e.target.value);
              setInputs({
                ...inputs,
                energy: { monthlyElectricity: val },
              });
              if (validationErrors.electricity) {
                setValidationErrors((prev) => ({ ...prev, electricity: '' }));
              }
            }}
            className={`w-full h-10 rounded-md border bg-surface-2 px-3 text-sm text-ink outline-none transition-colors focus:ring-1 ${
              validationErrors.electricity
                ? 'border-error focus:border-error focus:ring-error/30'
                : 'border-hairline focus:border-brand-blue focus:ring-brand-blue/30'
            }`}
          />
          {validationErrors.electricity && (
            <p className="mt-2 text-xs text-error font-medium">{validationErrors.electricity}</p>
          )}
          <p className="mt-2 text-xs text-mute">Average household: 200–300 kWh/month</p>
        </fieldset>

        {/* Diet */}
        <fieldset className="card-elevated rounded-xl p-6 animate-slide-up border-0" style={{ animationDelay: '160ms' }} id="input-diet">
          <legend className="flex items-center gap-2 mb-5 text-base font-semibold text-ink tracking-tight w-full">
            <Utensils className="h-4 w-4 text-cat-diet" />
            <span>Diet</span>
          </legend>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Diet Type">
            {DIET_TYPES.map((diet) => (
              <button
                key={diet.value}
                type="button"
                role="radio"
                aria-checked={inputs.diet.type === diet.value}
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
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          id="calculate-button"
          className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-medium text-white transition-all hover:bg-ink/80 hover:scale-[1.01] active:scale-[0.99] animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          Calculate My Footprint
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
