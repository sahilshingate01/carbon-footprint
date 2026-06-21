import type { CalculatorInputs, EmissionBreakdown, EcoScore } from '@/types';
import { EMISSION_FACTORS, GLOBAL_AVG_ANNUAL, WEEKS_PER_MONTH, WEEKS_PER_YEAR } from './constants';

/**
 * Round a number to 2 decimal places.
 * @param value - The numeric value to round.
 * @returns The rounded number.
 */
export function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculate weekly CO2 emissions in kg from user inputs.
 * @param inputs - The calculator inputs from the user form.
 * @returns An EmissionBreakdown with transport, energy, diet, and total.
 */
export function calculateEmissions(inputs: CalculatorInputs): EmissionBreakdown {
  // Transport: distance per week * emission factor per km
  const transportWeekly =
    inputs.transport.distancePerWeek *
    EMISSION_FACTORS.transport[inputs.transport.mode];

  // Energy: monthly kWh / weeks per month * emission factor
  const energyWeekly =
    (inputs.energy.monthlyElectricity / WEEKS_PER_MONTH) *
    EMISSION_FACTORS.energy.electricity;

  // Diet: daily emissions * 7 days
  const dietWeekly = EMISSION_FACTORS.diet[inputs.diet.type] * 7;

  const total = transportWeekly + energyWeekly + dietWeekly;

  return {
    transport: roundTo2(transportWeekly),
    energy: roundTo2(energyWeekly),
    diet: roundTo2(dietWeekly),
    total: roundTo2(total),
  };
}

/**
 * Calculate an eco-score (0–100) based on weekly emissions.
 * Lower emissions = higher score.
 * @param emissions - The weekly emission breakdown.
 * @returns The calculated EcoScore including score, grade, and label.
 */
export function calculateEcoScore(emissions: EmissionBreakdown): EcoScore {
  // Compare against global average weekly emissions
  const avgWeekly = GLOBAL_AVG_ANNUAL / WEEKS_PER_YEAR; // ~90.4 kg CO2/week
  const ratio = emissions.total / avgWeekly;

  // Score: 100 when ratio is 0, 0 when ratio >= 2
  let score = Math.round(Math.max(0, Math.min(100, (1 - ratio / 2) * 100)));
  score = Math.max(0, Math.min(100, score));

  let grade: EcoScore['grade'];
  let label: string;

  if (score >= 80) {
    grade = 'A';
    label = 'Excellent';
  } else if (score >= 60) {
    grade = 'B';
    label = 'Good';
  } else if (score >= 40) {
    grade = 'C';
    label = 'Average';
  } else if (score >= 20) {
    grade = 'D';
    label = 'Below Average';
  } else {
    grade = 'F';
    label = 'Poor';
  }

  return { score, grade, label };
}

/**
 * Annualize weekly emissions (multiply by 52).
 * @param weeklyTotal - The total emissions per week in kg CO2.
 * @returns The annualized emissions in kg CO2.
 */
export function annualizeEmissions(weeklyTotal: number): number {
  return Math.round(weeklyTotal * WEEKS_PER_YEAR);
}

/**
 * Get a percentage breakdown of emissions by category.
 * @param emissions - The weekly emission breakdown.
 * @returns The percentage breakdown for transport, energy, and diet.
 */
export function getPercentageBreakdown(emissions: EmissionBreakdown): {
  transport: number;
  energy: number;
  diet: number;
} {
  if (emissions.total === 0) {
    return { transport: 0, energy: 0, diet: 0 };
  }
  return {
    transport: Math.round((emissions.transport / emissions.total) * 100),
    energy: Math.round((emissions.energy / emissions.total) * 100),
    diet: Math.round((emissions.diet / emissions.total) * 100),
  };
}
