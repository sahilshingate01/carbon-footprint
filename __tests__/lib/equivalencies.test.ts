import { describe, test, expect } from 'vitest';
import { getCarbonEquivalents } from '@/lib/equivalencies';

describe('equivalencies.ts unit tests', () => {
  test('calculates correct equivalents for typical emission values', () => {
    // Test with 22 kg CO2 (should equal exactly 1 tree-year)
    const eq1 = getCarbonEquivalents(22);
    expect(eq1.treesYear).toBe(1);
    expect(eq1.drivingKm).toBeCloseTo(110, 1);
    expect(eq1.flightKm).toBeCloseTo(191.3, 1);
    expect(eq1.lightbulbHours).toBeCloseTo(916.7, 1);

    // Test with 100 kg CO2
    const eq2 = getCarbonEquivalents(100);
    expect(eq2.treesYear).toBeCloseTo(4.55, 2);
    expect(eq2.drivingKm).toBe(500);
    expect(eq2.flightKm).toBeCloseTo(869.57, 2);
    expect(eq2.lightbulbHours).toBeCloseTo(4166.67, 2);
  });

  test('handles zero emissions correctly', () => {
    const eq = getCarbonEquivalents(0);
    expect(eq.treesYear).toBe(0);
    expect(eq.drivingKm).toBe(0);
    expect(eq.flightKm).toBe(0);
    expect(eq.lightbulbHours).toBe(0);
  });
});
