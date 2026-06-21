import { z } from 'zod';
import type { UserData, WeeklyEntry, CalculatorInputs, EmissionBreakdown, EcoScore } from '@/types';
import { STORAGE_KEY } from './constants';

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

  // Enforce FIFO limit cap of 520 entries (10 years of weekly data)
  if (data.entries.length > 520) {
    data.entries = data.entries.slice(-520);
  }

  data.lastCalculation = inputs;
  saveUserData(data);

  return entry;
}

export function getRecentEntries(data: UserData, count = 10): WeeklyEntry[] {
  return data.entries.slice(-count);
}

export function getMonthlyAggregates(data: UserData) {
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
    totalEmissions: Math.round(agg.totalEmissions * 100) / 100,
    avgEcoScore: Math.round(agg.totalScore / agg.count),
    entries: agg.count,
    breakdown: {
      transport: Math.round(agg.transport * 100) / 100,
      energy: Math.round(agg.energy * 100) / 100,
      diet: Math.round(agg.diet * 100) / 100,
      total: Math.round(agg.totalEmissions * 100) / 100,
    },
  }));
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export interface StorageUsage {
  usedBytes: number;
  maxBytes: number;
  percentage: number;
  isApproachingLimit: boolean;
}

export function getLocalStorageUsage(): StorageUsage {
  const maxBytes = 5 * 1024 * 1024; // 5MB limit
  if (typeof window === 'undefined') {
    return { usedBytes: 0, maxBytes, percentage: 0, isApproachingLimit: false };
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
    const percentage = (total / maxBytes) * 100;
    return {
      usedBytes: total,
      maxBytes,
      percentage: Math.round(percentage * 100) / 100,
      isApproachingLimit: percentage >= 80, // Warning threshold at 80% (4MB)
    };
  } catch (error) {
    console.error("Error calculating localStorage usage:", error);
    return { usedBytes: 0, maxBytes, percentage: 0, isApproachingLimit: false };
  }
}

export function exportUserData(): void {
  if (typeof window === 'undefined') return;
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
}

export interface ImportResult {
  success: boolean;
  error?: string;
}

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
