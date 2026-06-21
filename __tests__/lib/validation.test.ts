import { describe, test, expect } from 'vitest';
import {
  validateDistance,
  validateElectricity,
  validateDietType,
  validateTransportMode,
  validateCalculatorInputs,
  sanitizeDistance,
  sanitizeElectricity,
  sanitizeTransportMode,
  sanitizeDietType,
  sanitizeCalculatorInputs
} from '../validation';

describe('validation.ts unit tests', () => {
  describe('validateDistance', () => {
    test('valid distances', () => {
      expect(validateDistance(0)).toBeNull();
      expect(validateDistance(500)).toBeNull();
      expect(validateDistance(2000)).toBeNull();
    });

    test('invalid distances', () => {
      expect(validateDistance(-1)).toContain('between 0 and 2000 km');
      expect(validateDistance(2001)).toContain('between 0 and 2000 km');
      expect(validateDistance(NaN)).toContain('valid finite number');
      expect(validateDistance(Infinity)).toContain('valid finite number');
      expect(validateDistance(null as unknown as number)).toContain('valid finite number');
      expect(validateDistance(undefined as unknown as number)).toContain('valid finite number');
    });
  });

  describe('validateElectricity', () => {
    test('valid electricity usage', () => {
      expect(validateElectricity(0)).toBeNull();
      expect(validateElectricity(250)).toBeNull();
      expect(validateElectricity(5000)).toBeNull();
    });

    test('invalid electricity usage', () => {
      expect(validateElectricity(-5)).toContain('between 0 and 5000 kWh');
      expect(validateElectricity(5001)).toContain('between 0 and 5000 kWh');
      expect(validateElectricity(NaN)).toContain('valid finite number');
      expect(validateElectricity(Infinity)).toContain('valid finite number');
      expect(validateElectricity(null as unknown as number)).toContain('valid finite number');
      expect(validateElectricity(undefined as unknown as number)).toContain('valid finite number');
    });
  });

  describe('validateDietType', () => {
    test('valid diet types', () => {
      expect(validateDietType('vegetarian')).toBeNull();
      expect(validateDietType('mixed')).toBeNull();
      expect(validateDietType('non-vegetarian')).toBeNull();
    });

    test('invalid diet types', () => {
      expect(validateDietType('vegan')).toContain('Diet type must be one of');
      expect(validateDietType('')).toContain('Diet type must be one of');
      expect(validateDietType(null as unknown as string)).toContain('Diet type must be one of');
    });
  });

  describe('validateTransportMode', () => {
    test('valid transport modes', () => {
      expect(validateTransportMode('car')).toBeNull();
      expect(validateTransportMode('bike')).toBeNull();
      expect(validateTransportMode('public')).toBeNull();
    });

    test('invalid transport modes', () => {
      expect(validateTransportMode('plane')).toContain('Transport mode must be one of');
      expect(validateTransportMode('')).toContain('Transport mode must be one of');
      expect(validateTransportMode(null as unknown as string)).toContain('Transport mode must be one of');
    });
  });

  describe('validateCalculatorInputs', () => {
    test('valid complete inputs returns isValid true', () => {
      const result = validateCalculatorInputs('car', 100, 250, 'mixed');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('invalid inputs returns validation errors details', () => {
      const result = validateCalculatorInputs('plane', -50, 6000, 'vegan');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(4);
      expect(result.errors.map(e => e.field)).toEqual(['transportMode', 'distance', 'electricity', 'dietType']);
    });
  });

  describe('sanitizeDistance', () => {
    test('sanitizes valid number', () => {
      expect(sanitizeDistance(150)).toBe(150);
    });

    test('clamps values within 0-2000 bounds', () => {
      expect(sanitizeDistance(-50)).toBe(0);
      expect(sanitizeDistance(3500)).toBe(2000);
    });

    test('converts numeric string', () => {
      expect(sanitizeDistance('450')).toBe(450);
      expect(sanitizeDistance('450.5abc')).toBe(450.5);
    });

    test('returns 0 for invalid formats/types', () => {
      expect(sanitizeDistance('not-a-number')).toBe(0);
      expect(sanitizeDistance(NaN)).toBe(0);
      expect(sanitizeDistance(Infinity)).toBe(0);
      expect(sanitizeDistance(null)).toBe(0);
      expect(sanitizeDistance(undefined)).toBe(0);
      expect(sanitizeDistance({})).toBe(0);
    });
  });

  describe('sanitizeElectricity', () => {
    test('sanitizes valid number', () => {
      expect(sanitizeElectricity(300)).toBe(300);
    });

    test('clamps values within 0-5000 bounds', () => {
      expect(sanitizeElectricity(-10)).toBe(0);
      expect(sanitizeElectricity(6000)).toBe(5000);
    });

    test('converts numeric string', () => {
      expect(sanitizeElectricity('1200')).toBe(1200);
    });

    test('returns 0 for invalid formats/types', () => {
      expect(sanitizeElectricity('invalid')).toBe(0);
      expect(sanitizeElectricity(NaN)).toBe(0);
      expect(sanitizeElectricity(null)).toBe(0);
      expect(sanitizeElectricity({})).toBe(0);
      expect(sanitizeElectricity(true)).toBe(0);
    });
  });

  describe('sanitizeTransportMode', () => {
    test('whitelists valid values', () => {
      expect(sanitizeTransportMode('car')).toBe('car');
      expect(sanitizeTransportMode('bike')).toBe('bike');
      expect(sanitizeTransportMode('public')).toBe('public');
    });

    test('returns default "car" for invalid values', () => {
      expect(sanitizeTransportMode('plane')).toBe('car');
      expect(sanitizeTransportMode(123)).toBe('car');
      expect(sanitizeTransportMode(null)).toBe('car');
    });
  });

  describe('sanitizeDietType', () => {
    test('whitelists valid values', () => {
      expect(sanitizeDietType('vegetarian')).toBe('vegetarian');
      expect(sanitizeDietType('mixed')).toBe('mixed');
      expect(sanitizeDietType('non-vegetarian')).toBe('non-vegetarian');
    });

    test('returns default "mixed" for invalid values', () => {
      expect(sanitizeDietType('vegan')).toBe('mixed');
      expect(sanitizeDietType(null)).toBe('mixed');
    });
  });

  describe('sanitizeCalculatorInputs', () => {
    test('sanitizes complete structure correctly', () => {
      const input = {
        transport: { mode: 'public', distancePerWeek: '150' },
        energy: { monthlyElectricity: -50 },
        diet: { type: 'vegetarian' }
      };

      const sanitized = sanitizeCalculatorInputs(input);
      expect(sanitized.transport.mode).toBe('public');
      expect(sanitized.transport.distancePerWeek).toBe(150);
      expect(sanitized.energy.monthlyElectricity).toBe(0);
      expect(sanitized.diet.type).toBe('vegetarian');
    });

    test('returns standard defaults for missing or non-object values', () => {
      const sanitized = sanitizeCalculatorInputs(null);
      expect(sanitized.transport.mode).toBe('car');
      expect(sanitized.transport.distancePerWeek).toBe(100);
      expect(sanitized.energy.monthlyElectricity).toBe(250);
      expect(sanitized.diet.type).toBe('mixed');
    });

    test('sanitizes partially missing properties in structure', () => {
      const input = {
        transport: null,
        energy: "not-an-object",
        diet: undefined
      };

      const sanitized = sanitizeCalculatorInputs(input);
      expect(sanitized.transport.mode).toBe('car');
      expect(sanitized.transport.distancePerWeek).toBe(0);
      expect(sanitized.energy.monthlyElectricity).toBe(0);
      expect(sanitized.diet.type).toBe('mixed');
    });
  });
});
