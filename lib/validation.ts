import type { CalculatorInputs, DietType, TransportMode } from '@/types';
import {
  VALID_TRANSPORT_MODES,
  VALID_DIET_TYPES,
  isValidDietType,
  isValidTransportMode,
} from './constants';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates travel distance per week (0-2000 km).
 */
export function validateDistance(distance: number): string | null {
  if (distance === undefined || distance === null || isNaN(distance) || !isFinite(distance)) {
    return 'Distance is required and must be a valid finite number';
  }
  if (distance < 0 || distance > 2000) {
    return 'Distance must be between 0 and 2000 km';
  }
  return null;
}

/**
 * Validates electricity usage per month (0-5000 kWh).
 */
export function validateElectricity(electricity: number): string | null {
  if (electricity === undefined || electricity === null || isNaN(electricity) || !isFinite(electricity)) {
    return 'Electricity is required and must be a valid finite number';
  }
  if (electricity < 0 || electricity > 5000) {
    return 'Electricity consumption must be between 0 and 5000 kWh';
  }
  return null;
}

/**
 * Validates diet type option.
 */
export function validateDietType(dietType: string): string | null {
  if (!dietType || !isValidDietType(dietType)) {
    return `Diet type must be one of: ${VALID_DIET_TYPES.join(', ')}`;
  }
  return null;
}

/**
 * Validates transport mode option.
 */
export function validateTransportMode(mode: string): string | null {
  if (!mode || !isValidTransportMode(mode)) {
    return `Transport mode must be one of: ${VALID_TRANSPORT_MODES.join(', ')}`;
  }
  return null;
}

/**
 * Validates all inputs of the carbon calculator.
 */
export function validateCalculatorInputs(
  transportMode: string,
  distance: number,
  electricity: number,
  dietType: string
): ValidationResult {
  const errors: ValidationError[] = [];

  const transportModeError = validateTransportMode(transportMode);
  if (transportModeError) {
    errors.push({ field: 'transportMode', message: transportModeError });
  }

  const distanceError = validateDistance(distance);
  if (distanceError) {
    errors.push({ field: 'distance', message: distanceError });
  }

  const electricityError = validateElectricity(electricity);
  if (electricityError) {
    errors.push({ field: 'electricity', message: electricityError });
  }

  const dietError = validateDietType(dietType);
  if (dietError) {
    errors.push({ field: 'dietType', message: dietError });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generic helper to parse, sanitize, and clamp a numeric input value.
 */
export function sanitizeNumericInput(value: unknown, min: number, max: number): number {
  if (value === undefined || value === null) {
    return 0;
  }
  let numVal = 0;
  if (typeof value === 'number') {
    numVal = value;
  } else if (typeof value === 'string') {
    numVal = parseFloat(value);
  } else {
    return 0;
  }

  if (isNaN(numVal) || !isFinite(numVal)) {
    return 0;
  }
  return Math.max(min, Math.min(max, numVal));
}

/**
 * Sanitizes travel distance per week. Clamps value between 0 and 2000 km,
 * and ensures it is a valid finite number.
 */
export function sanitizeDistance(distance: unknown): number {
  return sanitizeNumericInput(distance, 0, 2000);
}

/**
 * Sanitizes monthly electricity usage. Clamps value between 0 and 5000 kWh,
 * and ensures it is a valid finite number.
 */
export function sanitizeElectricity(electricity: unknown): number {
  return sanitizeNumericInput(electricity, 0, 5000);
}

/**
 * Whitelists the transport mode to valid modes: 'car', 'bike', or 'public'.
 */
export function sanitizeTransportMode(mode: unknown): TransportMode {
  if (typeof mode === 'string' && isValidTransportMode(mode)) {
    return mode;
  }
  return 'car';
}

/**
 * Whitelists the diet type to valid types: 'vegetarian', 'mixed', or 'non-vegetarian'.
 */
export function sanitizeDietType(dietType: unknown): DietType {
  if (typeof dietType === 'string' && isValidDietType(dietType)) {
    return dietType;
  }
  return 'mixed';
}

/**
 * Sanitizes all fields of the carbon calculator inputs structure.
 */
export function sanitizeCalculatorInputs(inputs: unknown): CalculatorInputs {
  if (!inputs || typeof inputs !== 'object') {
    return {
      transport: { mode: 'car', distancePerWeek: 100 },
      energy: { monthlyElectricity: 250 },
      diet: { type: 'mixed' },
    };
  }

  const obj = inputs as Record<string, unknown>;
  const transport = (obj.transport && typeof obj.transport === 'object' ? obj.transport : {}) as Record<string, unknown>;
  const energy = (obj.energy && typeof obj.energy === 'object' ? obj.energy : {}) as Record<string, unknown>;
  const diet = (obj.diet && typeof obj.diet === 'object' ? obj.diet : {}) as Record<string, unknown>;

  return {
    transport: {
      mode: sanitizeTransportMode(transport.mode),
      distancePerWeek: sanitizeDistance(transport.distancePerWeek),
    },
    energy: {
      monthlyElectricity: sanitizeElectricity(energy.monthlyElectricity),
    },
    diet: {
      type: sanitizeDietType(diet.type),
    },
  };
}
