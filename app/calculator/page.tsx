'use client';

import { useState, useCallback } from 'react';
import { Car, Bike, Bus, Zap, Utensils, ArrowRight, Check } from 'lucide-react';
import type { CalculatorInputs, DietType, EmissionBreakdown, EcoScore } from '@/types';
import { TRANSPORT_MODES, DIET_TYPES } from '@/lib/constants';
import { calculateEmissions, calculateEcoScore } from '@/lib/calculations';
import { useUserData } from '@/hooks/useUserData';
import { validateCalculatorInputs, sanitizeCalculatorInputs } from '@/lib/validation';
import CalculatorResults from '@/components/CalculatorResults';
import StorageWarning from '@/components/StorageWarning';

const transportIcons: Record<string, React.ReactNode> = {
  car: <Car className="h-5 w-5" />,
  bike: <Bike className="h-5 w-5" />,
  public: <Bus className="h-5 w-5" />,
};

/**
 * CalculatorPage contains the input questionnaire form for carbon footprint calculations.
 * If calculations are run, it transitions to render the CalculatorResults report page.
 */
export default function CalculatorPage() {
  const { quota, addEntry, data, updateData } = useUserData();

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  const handleReset = useCallback(() => {
    setStep('input');
    setResults(null);
    setValidationErrors({});
    setInputs({
      transport: { mode: 'car', distancePerWeek: 100 },
      energy: { monthlyElectricity: 250 },
      diet: { type: 'mixed' },
    });
  }, []);

  if (step === 'results' && results) {
    return (
      <CalculatorResults
        inputs={inputs}
        results={results}
        quota={quota}
        onReset={handleReset}
        completedSuggestions={data?.completedSuggestions}
        completedPlanDays={data?.completedPlanDays}
        updateData={updateData}
      />
    );
  }

  // Input form
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Storage Limit Warning */}
      <StorageWarning quota={quota} />
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

          <div className="grid grid-cols-3 gap-2 mb-5" role="radiogroup" aria-label="Transport Mode" aria-required="true">
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
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Diet Type" aria-required="true">
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
