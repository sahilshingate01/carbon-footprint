import type { UserData, WeeklyEntry, CalculatorInputs, EmissionBreakdown, EcoScore } from '@/types';
import { STORAGE_KEY } from './constants';

function getDefaultData(): UserData {
  return {
    entries: [],
    lastCalculation: null,
    createdAt: new Date().toISOString(),
  };
}

export function loadUserData(): UserData {
  if (typeof window === 'undefined') return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return JSON.parse(raw) as UserData;
  } catch {
    return getDefaultData();
  }
}

export function saveUserData(data: UserData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
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
  data.lastCalculation = inputs;
  saveUserData(data);

  return entry;
}

export function getRecentEntries(count = 10): WeeklyEntry[] {
  const data = loadUserData();
  return data.entries.slice(-count);
}

export function getMonthlyAggregates() {
  const data = loadUserData();
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
