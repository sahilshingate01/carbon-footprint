import { EQUIVALENCY_FACTORS } from './constants';

export interface CarbonEquivalents {
  treesYear: number;
  drivingKm: number;
  flightKm: number;
  lightbulbHours: number;
}

/**
 * Calculates carbon equivalents for a given amount of CO2 emissions in kg.
 *
 * Factors:
 * - Trees: 1 mature tree absorbs ~22 kg CO2 per year.
 * - Driving: Average passenger vehicle emits ~0.20 kg CO2 per km.
 * - Flight: Commercial passenger flight emits ~0.115 kg CO2 per km per passenger.
 * - Lightbulb: Running a 60W incandescent bulb for 1 hour emits ~0.024 kg CO2.
 *
 * @param emissionsKg - The total carbon emissions in kg CO2.
 * @returns An object containing equivalent values for trees, driving distance, flight distance, and lightbulb hours.
 */
export function getCarbonEquivalents(emissionsKg: number): CarbonEquivalents {
  return {
    treesYear: emissionsKg / EQUIVALENCY_FACTORS.treesYear,
    drivingKm: emissionsKg / EQUIVALENCY_FACTORS.drivingKm,
    flightKm: emissionsKg / EQUIVALENCY_FACTORS.flightKm,
    lightbulbHours: emissionsKg / EQUIVALENCY_FACTORS.lightbulbHours,
  };
}
