'use client';

import { useState, useMemo } from 'react';
import { COUNTRY_AVERAGES } from '@/lib/constants';

interface RegionalComparisonProps {
  /**
   * The annualized carbon emissions (in kg CO2) for comparison.
   */
  annual: number;
}

/**
 * RegionalComparison component displays a comparison bar chart
 * of the user's annualized emissions versus national averages per capita.
 */
export default function RegionalComparison({ annual }: RegionalComparisonProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState('GL');

  const selectedCountry = useMemo(() => {
    return COUNTRY_AVERAGES.find((c) => c.code === selectedCountryCode) || COUNTRY_AVERAGES[5];
  }, [selectedCountryCode]);

  const maxVal = Math.max(annual, selectedCountry.annualPerCapita);

  const userBarWidth = maxVal > 0 ? (annual / maxVal) * 100 : 0;
  const countryBarWidth = maxVal > 0 ? (selectedCountry.annualPerCapita / maxVal) * 100 : 0;

  return (
    <div className="card-elevated rounded-xl p-6 animate-slide-up" style={{ animationDelay: '50ms' }} id="regional-comparison">
      <h2 className="text-base font-semibold text-ink tracking-tight mb-2">Regional Comparison</h2>
      <p id="country-selector-description" className="text-xs text-mute mb-4">
        Compare your footprint against national averages per capita
      </p>
      <div className="mb-4">
        <label htmlFor="country-selector" className="sr-only">
          Select Country
        </label>
        <select
          id="country-selector"
          value={selectedCountryCode}
          onChange={(e) => setSelectedCountryCode(e.target.value)}
          aria-describedby="country-selector-description"
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
              style={{ width: `${Math.max(5, Math.min(100, userBarWidth))}%` }}
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
              style={{ width: `${Math.max(5, Math.min(100, countryBarWidth))}%` }}
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
  );
}
