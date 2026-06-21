import { describe, test, expect } from 'vitest';
import { generateSuggestions, generateReductionPlan } from '../suggestions';
import type { CalculatorInputs, EmissionBreakdown } from '@/types';

describe('suggestions.ts unit tests', () => {
  describe('generateSuggestions', () => {
    test('should generate suggestions for car user', () => {
      const inputs: CalculatorInputs = {
        transport: { mode: 'car', distancePerWeek: 150 },
        energy: { monthlyElectricity: 100 },
        diet: { type: 'vegetarian' }
      };
      const emissions: EmissionBreakdown = { transport: 31.5, energy: 9.7, diet: 26.6, total: 67.8 };

      const suggestions = generateSuggestions(inputs, emissions);

      // Car user should get switch-public, carpool, ev-switch, remote-work (since distance > 100)
      const ids = suggestions.map(s => s.id);
      expect(ids).toContain('switch-public');
      expect(ids).toContain('carpool');
      expect(ids).toContain('ev-switch');
      expect(ids).toContain('remote-work');

      // Bike commute is NOT for car user
      expect(ids).not.toContain('bike-commute');
    });

    test('should generate suggestions for bike user', () => {
      const inputs: CalculatorInputs = {
        transport: { mode: 'bike', distancePerWeek: 150 },
        energy: { monthlyElectricity: 100 },
        diet: { type: 'vegetarian' }
      };
      const emissions: EmissionBreakdown = { transport: 0, energy: 9.7, diet: 26.6, total: 36.3 };

      const suggestions = generateSuggestions(inputs, emissions);
      const ids = suggestions.map(s => s.id);
      expect(ids).not.toContain('switch-public');
      expect(ids).not.toContain('carpool');
      expect(ids).not.toContain('ev-switch');
      expect(ids).not.toContain('bike-commute');
    });

    test('should generate suggestions for public transit user with distance > 30', () => {
      const inputs: CalculatorInputs = {
        transport: { mode: 'public', distancePerWeek: 40 },
        energy: { monthlyElectricity: 100 },
        diet: { type: 'vegetarian' }
      };
      const emissions: EmissionBreakdown = { transport: 3.56, energy: 9.7, diet: 26.6, total: 39.86 };

      const suggestions = generateSuggestions(inputs, emissions);
      const ids = suggestions.map(s => s.id);
      expect(ids).toContain('bike-commute');
    });

    test('should suggest electricity reduction for high electricity user (> 300 kWh)', () => {
      const inputs: CalculatorInputs = {
        transport: { mode: 'bike', distancePerWeek: 0 },
        energy: { monthlyElectricity: 350 },
        diet: { type: 'vegetarian' }
      };
      const emissions: EmissionBreakdown = { transport: 0, energy: 33.9, diet: 26.6, total: 60.5 };

      const suggestions = generateSuggestions(inputs, emissions);
      const ids = suggestions.map(s => s.id);
      expect(ids).toContain('reduce-electricity');
      expect(ids).toContain('smart-thermostat');
      expect(ids).toContain('renewable-energy');
    });

    test('should suggest meat reduction for non-vegetarian user', () => {
      const inputs: CalculatorInputs = {
        transport: { mode: 'bike', distancePerWeek: 0 },
        energy: { monthlyElectricity: 100 },
        diet: { type: 'non-vegetarian' }
      };
      const emissions: EmissionBreakdown = { transport: 0, energy: 9.7, diet: 50.4, total: 60.1 };

      const suggestions = generateSuggestions(inputs, emissions);
      const ids = suggestions.map(s => s.id);
      expect(ids).toContain('reduce-meat');
      expect(ids).toContain('local-food');
      expect(ids).not.toContain('more-plant-based');
    });

    test('should suggest more plant-based meals for mixed diet user', () => {
      const inputs: CalculatorInputs = {
        transport: { mode: 'bike', distancePerWeek: 0 },
        energy: { monthlyElectricity: 100 },
        diet: { type: 'mixed' }
      };
      const emissions: EmissionBreakdown = { transport: 0, energy: 9.7, diet: 39.2, total: 48.9 };

      const suggestions = generateSuggestions(inputs, emissions);
      const ids = suggestions.map(s => s.id);
      expect(ids).toContain('more-plant-based');
      expect(ids).not.toContain('reduce-meat');
    });
  });

  describe('generateReductionPlan', () => {
    test('should generate default reduction plan with 30 days', () => {
      const inputs: CalculatorInputs = {
        transport: { mode: 'car', distancePerWeek: 50 },
        energy: { monthlyElectricity: 100 },
        diet: { type: 'mixed' }
      };

      const plan = generateReductionPlan(inputs);
      expect(plan.length).toBe(30);
      expect(plan[0].day).toBe(1);
      expect(plan[29].day).toBe(30);
    });

    test('should customize plan for bike user', () => {
      const inputs: CalculatorInputs = {
        transport: { mode: 'bike', distancePerWeek: 50 },
        energy: { monthlyElectricity: 100 },
        diet: { type: 'mixed' }
      };

      const plan = generateReductionPlan(inputs);
      // Day 5 task should be updated for bike user (0-indexed index 4)
      expect(plan[4].task).toBe('Encourage a friend to cycle');
      expect(plan[4].tip).toBe('You already cycle — help someone else start!');
      // Day 11 task should be updated for bike user (0-indexed index 10)
      expect(plan[10].task).toBe('Explore new cycling routes');
      expect(plan[10].tip).toBe('Finding scenic routes makes cycling even more enjoyable.');
    });

    test('should customize plan for vegetarian user', () => {
      const inputs: CalculatorInputs = {
        transport: { mode: 'car', distancePerWeek: 50 },
        energy: { monthlyElectricity: 100 },
        diet: { type: 'vegetarian' }
      };

      const plan = generateReductionPlan(inputs);
      // Day 3 task should be updated for vegetarian user (0-indexed index 2)
      expect(plan[2].task).toBe('Try a fully vegan meal');
      expect(plan[2].tip).toBe('Even vegetarian diets can be improved by reducing dairy.');
      // Day 19 task should be updated for vegetarian user (0-indexed index 18)
      expect(plan[18].task).toBe('Research vegan protein sources');
      expect(plan[18].tip).toBe('Tofu, tempeh, seitan, and legumes are excellent protein sources.');
    });
  });
});
