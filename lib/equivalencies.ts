/**
 * Conversion utility functions for translating carbon emissions (kg CO2)
 * into relatable everyday equivalents.
 */

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
 */
export function getCarbonEquivalents(emissionsKg: number): CarbonEquivalents {
  return {
    treesYear: emissionsKg / 22,
    drivingKm: emissionsKg / 0.20,
    flightKm: emissionsKg / 0.115,
    lightbulbHours: emissionsKg / 0.024,
  };
}
