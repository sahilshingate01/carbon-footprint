import { beforeEach, describe, test, expect, vi } from 'vitest';
import {
  loadUserData,
  saveUserData,
  addEntry,
  getRecentEntries,
  getMonthlyAggregates,
  clearAllData,
  getLocalStorageUsage,
  importUserData,
  exportUserData
} from '../storage';
import { STORAGE_KEY } from '../constants';
import type { UserData, CalculatorInputs, EmissionBreakdown, EcoScore, WeeklyEntry } from '@/types';

// In-memory mock for localStorage
class LocalStorageMock {
  private store: Record<string, string> = {};

  get length() {
    return Object.keys(this.store).length;
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }
}

const mockLocalStorage = new LocalStorageMock();
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock URL createObjectURL / revokeObjectURL for exportUserData tests
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  window.URL.revokeObjectURL = vi.fn();
}

describe('storage.ts unit tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  const validInputs: CalculatorInputs = {
    transport: { mode: 'car', distancePerWeek: 150 },
    energy: { monthlyElectricity: 200 },
    diet: { type: 'mixed' }
  };

  const validEmissions: EmissionBreakdown = {
    transport: 31.5,
    energy: 19.4,
    diet: 39.2,
    total: 90.1
  };

  const validEcoScore: EcoScore = {
    score: 50,
    grade: 'C',
    label: 'Average'
  };

  describe('loadUserData', () => {
    test('returns default structure when localStorage is empty', () => {
      const data = loadUserData();
      expect(data.entries).toEqual([]);
      expect(data.lastCalculation).toBeNull();
      expect(data.createdAt).toBeDefined();
    });

    test('returns parsed data when valid data is in localStorage', () => {
      const mockData: UserData = {
        entries: [
          {
            id: 'entry-1',
            date: new Date().toISOString(),
            weekNumber: 25,
            inputs: validInputs,
            emissions: validEmissions,
            ecoScore: validEcoScore
          }
        ],
        lastCalculation: validInputs,
        createdAt: new Date().toISOString()
      };

      mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));

      const loaded = loadUserData();
      expect(loaded.entries.length).toBe(1);
      expect(loaded.lastCalculation).toEqual(validInputs);
    });

    test('successfully parses older UserData formats without new fields and populates defaults', () => {
      const olderMockData = {
        entries: [],
        lastCalculation: null,
        createdAt: new Date().toISOString(),
      };

      mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(olderMockData));

      const loaded = loadUserData();
      expect(loaded.entries).toEqual([]);
      expect(loaded.weeklyGoal).toBeNull();
      expect(loaded.completedSuggestions).toEqual([]);
      expect(loaded.completedPlanDays).toEqual([]);
    });

    test('returns default structure and logs error on schema violation', () => {
      const corruptedData = {
        entries: [
          {
            id: 12345, // invalid type: should be string
            date: 'not-a-date',
            inputs: {}
          }
        ]
      };
      mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(corruptedData));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const loaded = loadUserData();

      expect(loaded.entries).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('returns default structure and logs syntax error on malformed JSON', () => {
      mockLocalStorage.setItem(STORAGE_KEY, '{invalid-json');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const loaded = loadUserData();

      expect(loaded.entries).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('saveUserData', () => {
    test('saves valid UserData to localStorage', () => {
      const mockData: UserData = {
        entries: [],
        lastCalculation: null,
        createdAt: new Date().toISOString()
      };

      saveUserData(mockData);

      const raw = mockLocalStorage.getItem(STORAGE_KEY);
      expect(raw).toBeDefined();
      const parsed = JSON.parse(raw!);
      expect(parsed.createdAt).toBe(mockData.createdAt);
    });

    test('refuses to save invalid UserData and logs error', () => {
      const invalidData = {
        entries: 'this-should-be-an-array'
      } as unknown as UserData;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      saveUserData(invalidData);

      expect(mockLocalStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('addEntry', () => {
    test('persists a new entry and updates lastCalculation', () => {
      const entry = addEntry(validInputs, validEmissions, validEcoScore);
      expect(entry.id).toBeDefined();
      expect(entry.inputs).toEqual(validInputs);
      expect(entry.emissions).toEqual(validEmissions);
      expect(entry.ecoScore).toEqual(validEcoScore);

      const loaded = loadUserData();
      expect(loaded.entries.length).toBe(1);
      expect(loaded.lastCalculation).toEqual(validInputs);
    });

    test('enforces FIFO limit cap of 520 entries', () => {
      // Seed with 520 mock entries
      const mockEntries: WeeklyEntry[] = Array.from({ length: 520 }, (_, i) => ({
        id: `entry-${i}`,
        date: new Date(2025, 0, 1 + i).toISOString(),
        weekNumber: (i % 52) + 1,
        inputs: validInputs,
        emissions: validEmissions,
        ecoScore: validEcoScore
      }));

      const initialData: UserData = {
        entries: mockEntries,
        lastCalculation: validInputs,
        createdAt: new Date().toISOString()
      };

      saveUserData(initialData);

      // Add 521st entry
      const newInputs = { ...validInputs, transport: { mode: 'bike' as const, distancePerWeek: 0 } };
      addEntry(newInputs, validEmissions, validEcoScore);

      const loaded = loadUserData();
      expect(loaded.entries.length).toBe(520);
      // The oldest entry (`entry-0`) should be removed, and `entry-1` should be the first
      expect(loaded.entries[0].id).toBe('entry-1');
      // The last entry should be the newly added one
      expect(loaded.entries[519].inputs.transport.mode).toBe('bike');
    });
  });

  describe('clearAllData', () => {
    test('removes STORAGE_KEY from localStorage', () => {
      mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify({ entries: [] }));
      expect(mockLocalStorage.getItem(STORAGE_KEY)).not.toBeNull();

      clearAllData();
      expect(mockLocalStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('getRecentEntries', () => {
    test('returns the correct number of recent entries', () => {
      const mockEntries: WeeklyEntry[] = Array.from({ length: 15 }, (_, i) => ({
        id: `entry-${i}`,
        date: new Date().toISOString(),
        weekNumber: 1,
        inputs: validInputs,
        emissions: validEmissions,
        ecoScore: validEcoScore
      }));

      const data: UserData = {
        entries: mockEntries,
        lastCalculation: validInputs,
        createdAt: new Date().toISOString()
      };

      const recent = getRecentEntries(data, 5);
      expect(recent.length).toBe(5);
      expect(recent[0].id).toBe('entry-10');
      expect(recent[4].id).toBe('entry-14');
    });
  });

  describe('getMonthlyAggregates', () => {
    test('groups entries by month and calculates averages correctly', () => {
      // 2 entries in Jan 2026, 1 entry in Feb 2026
      const mockEntries: WeeklyEntry[] = [
        {
          id: 'entry-1',
          date: new Date('2026-01-05T12:00:00Z').toISOString(),
          weekNumber: 1,
          inputs: validInputs,
          emissions: { transport: 10, energy: 20, diet: 30, total: 60 },
          ecoScore: { score: 70, grade: 'B', label: 'Good' }
        },
        {
          id: 'entry-2',
          date: new Date('2026-01-15T12:00:00Z').toISOString(),
          weekNumber: 2,
          inputs: validInputs,
          emissions: { transport: 15, energy: 25, diet: 35, total: 75 },
          ecoScore: { score: 60, grade: 'B', label: 'Good' }
        },
        {
          id: 'entry-3',
          date: new Date('2026-02-10T12:00:00Z').toISOString(),
          weekNumber: 6,
          inputs: validInputs,
          emissions: { transport: 5, energy: 15, diet: 25, total: 45 },
          ecoScore: { score: 90, grade: 'A', label: 'Excellent' }
        }
      ];

      const data: UserData = {
        entries: mockEntries,
        lastCalculation: validInputs,
        createdAt: new Date().toISOString()
      };

      const aggregates = getMonthlyAggregates(data);
      expect(aggregates.length).toBe(2);

      // Verify January
      const jan = aggregates.find(a => a.month === 'Jan 2026');
      expect(jan).toBeDefined();
      expect(jan!.entries).toBe(2);
      expect(jan!.totalEmissions).toBe(135); // 60 + 75
      expect(jan!.avgEcoScore).toBe(65); // (70 + 60) / 2
      expect(jan!.breakdown).toEqual({ transport: 25, energy: 45, diet: 65, total: 135 });

      // Verify February
      const feb = aggregates.find(a => a.month === 'Feb 2026');
      expect(feb).toBeDefined();
      expect(feb!.entries).toBe(1);
      expect(feb!.totalEmissions).toBe(45);
      expect(feb!.avgEcoScore).toBe(90);
    });
  });

  describe('getLocalStorageUsage', () => {
    test('calculates correct bytes and approaching limit status', () => {
      mockLocalStorage.setItem('key1', 'abc'); // key1 length is 4, val is 3. Total UTF-16 characters = 7. Bytes = 14
      mockLocalStorage.setItem('key2', 'defgh'); // key2 length is 4, val is 5. Total = 9. Bytes = 18

      const usage = getLocalStorageUsage();
      expect(usage.usedBytes).toBe(32);
      expect(usage.maxBytes).toBe(5 * 1024 * 1024);
      expect(usage.percentage).toBeLessThan(1);
      expect(usage.isApproachingLimit).toBe(false);
    });
  });

  describe('importUserData', () => {
    test('imports valid JSON and returns success', () => {
      const mockData: UserData = {
        entries: [],
        lastCalculation: null,
        createdAt: new Date().toISOString()
      };

      const result = importUserData(JSON.stringify(mockData));
      expect(result.success).toBe(true);

      const loaded = loadUserData();
      expect(loaded.createdAt).toBe(mockData.createdAt);
    });

    test('fails on schema validation error', () => {
      const invalidData = {
        entries: 'invalid-data-type'
      };

      const result = importUserData(JSON.stringify(invalidData));
      expect(result.success).toBe(false);
      expect(result.error).toContain('expected array');
    });

    test('fails on syntax error', () => {
      const result = importUserData('{corrupted');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Malformed JSON');
    });
  });

  describe('exportUserData', () => {
    test('triggers browser download workflow', () => {
      const docSpy = vi.spyOn(document, 'createElement');
      const clickSpy = vi.fn();
      
      docSpy.mockReturnValue({
        href: '',
        download: '',
        click: clickSpy,
        style: {}
      } as unknown as HTMLAnchorElement);

      const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => ({} as unknown as Node));
      const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => ({} as unknown as Node));

      exportUserData();

      expect(docSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });
  });
});
