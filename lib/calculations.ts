import type { CalculatorInputs, EmissionBreakdown, EcoScore } from '@/types';
import { EMISSION_FACTORS, GLOBAL_AVG_ANNUAL } from './constants';

/**
 * Calculate weekly CO2 emissions in kg from user inputs.
 */
export function calculateEmissions(inputs: CalculatorInputs): EmissionBreakdown {
  // Transport: distance per week * emission factor per km
  const transportWeekly =
    inputs.transport.distancePerWeek *
    EMISSION_FACTORS.transport[inputs.transport.mode];

  // Energy: monthly kWh / 4.33 weeks per month * emission factor
  const energyWeekly =
    (inputs.energy.monthlyElectricity / 4.33) *
    EMISSION_FACTORS.energy.electricity;

  // Diet: daily emissions * 7 days
  const dietWeekly = EMISSION_FACTORS.diet[inputs.diet.type] * 7;

  const total = transportWeekly + energyWeekly + dietWeekly;

  return {
    transport: Math.round(transportWeekly * 100) / 100,
    energy: Math.round(energyWeekly * 100) / 100,
    diet: Math.round(dietWeekly * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Calculate an eco-score (0–100) based on weekly emissions.
 * Lower emissions = higher score.
 */
export function calculateEcoScore(emissions: EmissionBreakdown): EcoScore {
  // Compare against global average weekly emissions
  const avgWeekly = GLOBAL_AVG_ANNUAL / 52; // ~90.4 kg CO2/week
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
 */
export function annualizeEmissions(weeklyTotal: number): number {
  return Math.round(weeklyTotal * 52);
}

/**
 * Get a percentage breakdown of emissions by category.
 */
export function getPercentageBreakdown(emissions: EmissionBreakdown) {
  if (emissions.total === 0) {
    return { transport: 0, energy: 0, diet: 0 };
  }
  return {
    transport: Math.round((emissions.transport / emissions.total) * 100),
    energy: Math.round((emissions.energy / emissions.total) * 100),
    diet: Math.round((emissions.diet / emissions.total) * 100),
  };
}
