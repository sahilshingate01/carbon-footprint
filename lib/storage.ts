import { z } from 'zod';
import type { UserData, WeeklyEntry, CalculatorInputs, EmissionBreakdown, EcoScore, MonthlyAggregate } from '@/types';
import {
  STORAGE_KEY,
  MAX_STORED_ENTRIES,
  LOCAL_STORAGE_MAX_BYTES,
  STORAGE_WARNING_THRESHOLD,
} from './constants';
import { roundTo2 } from './calculations';

// Zod schemas for validating data integrity
export const TransportDataSchema = z.object({
  mode: z.enum(['car', 'bike', 'public']),
  distancePerWeek: z.number().min(0).max(2000),
});

export const EnergyDataSchema = z.object({
  monthlyElectricity: z.number().min(0).max(5000),
});

export const DietDataSchema = z.object({
  type: z.enum(['vegetarian', 'mixed', 'non-vegetarian']),
});

export const CalculatorInputsSchema = z.object({
  transport: TransportDataSchema,
  energy: EnergyDataSchema,
  diet: DietDataSchema,
});

export const EmissionBreakdownSchema = z.object({
  transport: z.number(),
  energy: z.number(),
  diet: z.number(),
  total: z.number(),
});

export const EcoScoreSchema = z.object({
  score: z.number().min(0).max(100),
  grade: z.enum(['A', 'B', 'C', 'D', 'F']),
  label: z.string(),
});

export const WeeklyEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  weekNumber: z.number().min(1).max(53),
  inputs: CalculatorInputsSchema,
  emissions: EmissionBreakdownSchema,
  ecoScore: EcoScoreSchema,
});

export const UserDataSchema = z.object({
  entries: z.array(WeeklyEntrySchema),
  lastCalculation: CalculatorInputsSchema.nullable(),
  createdAt: z.string(),
  weeklyGoal: z.number().nullable().optional().default(null),
  completedSuggestions: z.array(z.string()).optional().default([]),
  completedPlanDays: z.array(z.number()).optional().default([]),
});

/**
 * Helper function to generate default state structure for UserData.
 * @returns An empty default UserData object.
 */
function getDefaultData(): UserData {
  return {
    entries: [],
    lastCalculation: null,
    createdAt: new Date().toISOString(),
    weeklyGoal: null,
    completedSuggestions: [],
    completedPlanDays: [],
  };
}

/**
 * Load user data from localStorage and validate against schema.
 * @returns The validated UserData object or default empty state.
 */
export function loadUserData(): UserData {
  if (typeof window === 'undefined') return getDefaultData();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getDefaultData();

  try {
    const parsed = JSON.parse(raw);
    const result = UserDataSchema.safeParse(parsed);
    if (!result.success) {
      console.error(
        "Failed to validate loaded UserData from localStorage against schema. Validation issues:",
        JSON.stringify(result.error.format(), null, 2)
      );
      return getDefaultData();
    }
    return result.data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Syntax error parsing LocalStorage data. It may be malformed JSON:", error.message);
    } else {
      console.error("Unknown error parsing LocalStorage data:", error);
    }
    return getDefaultData();
  }
}

/**
 * Save user data to localStorage after validating against schema.
 * @param data - The UserData object to persist.
 */
export function saveUserData(data: UserData): void {
  if (typeof window === 'undefined') return;
  try {
    const result = UserDataSchema.safeParse(data);
    if (!result.success) {
      console.error(
        "Refusing to save invalid UserData to localStorage. Validation issues:",
        JSON.stringify(result.error.format(), null, 2)
      );
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }
}

/**
 * Add a new weekly calculation entry to user data history and cap the size.
 * @param inputs - The inputs used for the calculation.
 * @param emissions - The calculated emission breakdown.
 * @param ecoScore - The calculated eco-score and grade.
 * @returns The newly created WeeklyEntry object.
 */
export function addEntry(
  inputs: CalculatorInputs,
  emissions: EmissionBreakdown,
  ecoScore: EcoScore
): WeeklyEntry {
  const data = loadUserData();

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - startOfYear.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.ceil(diff / oneWeek);

  const entry: WeeklyEntry = {
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: now.toISOString(),
    weekNumber,
    inputs,
    emissions,
    ecoScore,
  };

  data.entries.push(entry);

  // Enforce FIFO limit cap of MAX_STORED_ENTRIES
  if (data.entries.length > MAX_STORED_ENTRIES) {
    data.entries = data.entries.slice(-MAX_STORED_ENTRIES);
  }

  data.lastCalculation = inputs;
  saveUserData(data);

  return entry;
}

/**
 * Get a sliced array of recent weekly entries.
 * @param data - The UserData containing entries.
 * @param count - The number of entries to retrieve (defaults to 10).
 * @returns Array of recent WeeklyEntry objects.
 */
export function getRecentEntries(data: UserData, count = 10): WeeklyEntry[] {
  return data.entries.slice(-count);
}

/**
 * Aggregates weekly data into monthly emissions and eco-score metrics.
 * @param data - The UserData containing entries.
 * @returns Array of MonthlyAggregate values.
 */
export function getMonthlyAggregates(data: UserData): MonthlyAggregate[] {
  const monthMap = new Map<string, {
    totalEmissions: number;
    totalScore: number;
    count: number;
    transport: number;
    energy: number;
    diet: number;
  }>();

  for (const entry of data.entries) {
    const date = new Date(entry.date);
    const key = `${date.toLocaleString('en', { month: 'short' })} ${date.getFullYear()}`;
    const existing = monthMap.get(key) ?? {
      totalEmissions: 0, totalScore: 0, count: 0,
      transport: 0, energy: 0, diet: 0,
    };
    existing.totalEmissions += entry.emissions.total;
    existing.totalScore += entry.ecoScore.score;
    existing.count += 1;
    existing.transport += entry.emissions.transport;
    existing.energy += entry.emissions.energy;
    existing.diet += entry.emissions.diet;
    monthMap.set(key, existing);
  }

  return Array.from(monthMap.entries()).map(([month, agg]) => ({
    month,
    totalEmissions: roundTo2(agg.totalEmissions),
    avgEcoScore: Math.round(agg.totalScore / agg.count),
    entries: agg.count,
    breakdown: {
      transport: roundTo2(agg.transport),
      energy: roundTo2(agg.energy),
      diet: roundTo2(agg.diet),
      total: roundTo2(agg.totalEmissions),
    },
  }));
}

/**
 * Deletes the user data stored under the main storage key in localStorage.
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear data from localStorage:", error);
  }
}

export interface StorageUsage {
  usedBytes: number;
  maxBytes: number;
  percentage: number;
  isApproachingLimit: boolean;
}

/**
 * Calculate the amount of bytes used in localStorage.
 * @returns StorageUsage containing used bytes, limit, percentage, and warning flag.
 */
export function getLocalStorageUsage(): StorageUsage {
  if (typeof window === 'undefined') {
    return { usedBytes: 0, maxBytes: LOCAL_STORAGE_MAX_BYTES, percentage: 0, isApproachingLimit: false };
  }

  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key);
        // Each character in JS strings is UTF-16 (2 bytes)
        total += (key.length + (val ? val.length : 0)) * 2;
      }
    }
    const percentage = (total / LOCAL_STORAGE_MAX_BYTES) * 100;
    return {
      usedBytes: total,
      maxBytes: LOCAL_STORAGE_MAX_BYTES,
      percentage: roundTo2(percentage),
      isApproachingLimit: percentage >= STORAGE_WARNING_THRESHOLD, // Warning threshold at 80%
    };
  } catch (error) {
    console.error("Error calculating localStorage usage:", error);
    return { usedBytes: 0, maxBytes: LOCAL_STORAGE_MAX_BYTES, percentage: 0, isApproachingLimit: false };
  }
}

/**
 * Export user data by triggering a download of a JSON file.
 * @returns Status of the export action.
 */
export function exportUserData(): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };
  try {
    const data = loadUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbontrack-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('Failed to export user data:', error);
    return { success: false, error: String(error) };
  }
}

export interface ImportResult {
  success: boolean;
  error?: string;
}

/**
 * Validate and import user data string in JSON format.
 * @param jsonString - The JSON formatted string to import.
 * @returns ImportResult indicating success or details of any failure.
 */
export function importUserData(jsonString: string): ImportResult {
  try {
    const parsed = JSON.parse(jsonString);
    const result = UserDataSchema.safeParse(parsed);
    if (!result.success) {
      // Format validation errors nicely
      const formattedErrors = result.error.issues.map(err => {
        const path = err.path.join('.');
        return `${path ? path : 'root'}: ${err.message}`;
      }).join('; ');
      console.error("Imported user data failed schema validation:", result.error.format());
      return { success: false, error: `Invalid data schema: ${formattedErrors}` };
    }
    saveUserData(result.data);
    return { success: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Syntax error parsing imported JSON data:", error.message);
      return { success: false, error: `Malformed JSON: ${error.message}` };
    }
    console.error("Unknown error importing data:", error);
    return { success: false, error: `Failed to parse import data: ${String(error)}` };
  }
}
