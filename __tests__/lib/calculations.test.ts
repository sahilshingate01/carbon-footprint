import { describe, test, expect } from 'vitest';
import {
  calculateEmissions,
  calculateEcoScore,
  annualizeEmissions,
  getPercentageBreakdown
} from '@/lib/calculations';
import { EMISSION_FACTORS } from '@/lib/constants';
import { validateCalculatorInputs, sanitizeCalculatorInputs } from '@/lib/validation';
import type { CalculatorInputs, EmissionBreakdown } from '@/types';

describe('calculations.ts unit tests', () => {
  describe('calculateEmissions', () => {
    const transportModes = ['car', 'bike', 'public'] as const;
    const dietTypes = ['vegetarian', 'mixed', 'non-vegetarian'] as const;

    // Test all 3 transport modes x 3 diet types (9 combos)
    transportModes.forEach(mode => {
      dietTypes.forEach(dietType => {
        test(`should calculate emissions correctly for transport mode: ${mode} and diet: ${dietType}`, () => {
          const inputs: CalculatorInputs = {
            transport: { mode, distancePerWeek: 100 },
            energy: { monthlyElectricity: 200 },
            diet: { type: dietType }
          };

          const result = calculateEmissions(inputs);

          const expectedTransport = 100 * EMISSION_FACTORS.transport[mode];
          const expectedEnergy = (200 / 4.33) * EMISSION_FACTORS.energy.electricity;
          const expectedDiet = EMISSION_FACTORS.diet[dietType] * 7;
          const expectedTotal = expectedTransport + expectedEnergy + expectedDiet;

          expect(result.transport).toBeCloseTo(expectedTransport, 2);
          expect(result.energy).toBeCloseTo(expectedEnergy, 2);
          expect(result.diet).toBeCloseTo(expectedDiet, 2);
          expect(result.total).toBeCloseTo(expectedTotal, 2);
        });
      });
    });
  });

  describe('calculateEcoScore', () => {
    test('boundary score 100 (zero total emissions)', () => {
      const emissions: EmissionBreakdown = { transport: 0, energy: 0, diet: 0, total: 0 };
      const ecoScore = calculateEcoScore(emissions);
      expect(ecoScore.score).toBe(100);
      expect(ecoScore.grade).toBe('A');
      expect(ecoScore.label).toBe('Excellent');
    });

    test('boundary score 80 (Excellent / Grade A)', () => {
      // ratio is 1 - score/100 * 2 = 0.4.
      // emissions.total = 0.4 * weeklyAvg
      // weeklyAvg = 4700 / 52 = 90.3846. total = 36.15
      const emissions: EmissionBreakdown = { transport: 0, energy: 0, diet: 0, total: 36.15 };
      const ecoScore = calculateEcoScore(emissions);
      expect(ecoScore.score).toBeGreaterThanOrEqual(80);
      expect(ecoScore.grade).toBe('A');
    });

    test('boundary score 60 (Good / Grade B)', () => {
      const emissions: EmissionBreakdown = { transport: 0, energy: 0, diet: 0, total: 72.3 };
      const ecoScore = calculateEcoScore(emissions);
      expect(ecoScore.score).toBeGreaterThanOrEqual(60);
      expect(ecoScore.grade).toBe('B');
    });

    test('boundary score 40 (Average / Grade C)', () => {
      const emissions: EmissionBreakdown = { transport: 0, energy: 0, diet: 0, total: 108.4 };
      const ecoScore = calculateEcoScore(emissions);
      expect(ecoScore.score).toBeGreaterThanOrEqual(40);
      expect(ecoScore.grade).toBe('C');
    });

    test('boundary score 20 (Below Average / Grade D)', () => {
      const emissions: EmissionBreakdown = { transport: 0, energy: 0, diet: 0, total: 144.6 };
      const ecoScore = calculateEcoScore(emissions);
      expect(ecoScore.score).toBeGreaterThanOrEqual(20);
      expect(ecoScore.grade).toBe('D');
    });

    test('boundary score 0 (Poor / Grade F)', () => {
      const emissions: EmissionBreakdown = { transport: 0, energy: 0, diet: 0, total: 200.0 };
      const ecoScore = calculateEcoScore(emissions);
      expect(ecoScore.score).toBe(0);
      expect(ecoScore.grade).toBe('F');
      expect(ecoScore.label).toBe('Poor');
    });

    test('exact score thresholds mapped to correct grades', () => {
      expect(calculateEcoScore({ transport: 0, energy: 0, diet: 0, total: 0 }).score).toBe(100);
      expect(calculateEcoScore({ transport: 0, energy: 0, diet: 0, total: 36.15 }).score).toBe(80);
      expect(calculateEcoScore({ transport: 0, energy: 0, diet: 0, total: 72.31 }).score).toBe(60);
      expect(calculateEcoScore({ transport: 0, energy: 0, diet: 0, total: 108.46 }).score).toBe(40);
      expect(calculateEcoScore({ transport: 0, energy: 0, diet: 0, total: 144.62 }).score).toBe(20);
      expect(calculateEcoScore({ transport: 0, energy: 0, diet: 0, total: 180.77 }).score).toBe(0);
    });
  });

  describe('annualizeEmissions', () => {
    test('should return weekly emissions multiplied by 52', () => {
      expect(annualizeEmissions(10)).toBe(520);
      expect(annualizeEmissions(1.5)).toBe(78);
    });
  });

  describe('getPercentageBreakdown', () => {
    test('should calculate percentage breakdown correctly', () => {
      const emissions: EmissionBreakdown = { transport: 30, energy: 50, diet: 20, total: 100 };
      const percentage = getPercentageBreakdown(emissions);
      expect(percentage.transport).toBe(30);
      expect(percentage.energy).toBe(50);
      expect(percentage.diet).toBe(20);
      expect(percentage.transport + percentage.energy + percentage.diet).toBe(100);
    });

    test('should handle zero total emissions gracefully', () => {
      const emissions: EmissionBreakdown = { transport: 0, energy: 0, diet: 0, total: 0 };
      const percentage = getPercentageBreakdown(emissions);
      expect(percentage.transport).toBe(0);
      expect(percentage.energy).toBe(0);
      expect(percentage.diet).toBe(0);
    });
  });

  describe('End-to-End calculation integration flow', () => {
    test('flows from raw input validation, sanitization, to emissions and eco-score calculations', () => {
      const rawInputs = {
        transportMode: 'car',
        distance: 120.5,
        electricity: 310.2,
        dietType: 'mixed'
      };

      // 1. Validate
      const validation = validateCalculatorInputs(
        rawInputs.transportMode,
        rawInputs.distance,
        rawInputs.electricity,
        rawInputs.dietType
      );
      expect(validation.isValid).toBe(true);

      // 2. Sanitize
      const sanitized = sanitizeCalculatorInputs({
        transport: { mode: rawInputs.transportMode, distancePerWeek: rawInputs.distance },
        energy: { monthlyElectricity: rawInputs.electricity },
        diet: { type: rawInputs.dietType }
      });
      expect(sanitized.transport.distancePerWeek).toBe(120.5);

      // 3. Calculate emissions
      const emissions = calculateEmissions(sanitized);
      expect(emissions.total).toBeGreaterThan(0);

      // 4. Calculate score
      const score = calculateEcoScore(emissions);
      expect(score.score).toBeGreaterThanOrEqual(0);
      expect(score.score).toBeLessThanOrEqual(100);
    });
  });
});
