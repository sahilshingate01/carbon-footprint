'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserData, CalculatorInputs, EmissionBreakdown, EcoScore, WeeklyEntry } from '@/types';
import {
  loadUserData,
  saveUserData,
  addEntry as addEntryToStorage,
  clearAllData,
  getLocalStorageUsage,
  exportUserData,
  importUserData,
  type StorageUsage,
  type ImportResult,
} from '@/lib/storage';

/**
 * Custom React hook that acts as a stateful client wrapper around localStorage storage utilities.
 * Exposes methods to retrieve, add, update, clear, import, and export user data, and track storage quota.
 * 
 * @returns An object containing:
 * - `data`: The stateful UserData object or null if loading.
 * - `quota`: Current localStorage quota usage statistics or null.
 * - `isLoading`: Boolean state indicating if the initial load is in progress.
 * - `addEntry`: Callback to insert a new calculation WeeklyEntry.
 * - `clearData`: Callback to purge all user data from localStorage.
 * - `updateData`: Callback to perform custom immutable updates to the state and localStorage.
 * - `importData`: Callback to validate and ingest user data from a JSON string.
 * - `exportData`: Callback to trigger a download export of user data.
 */
export function useUserData(): {
  data: UserData | null;
  quota: StorageUsage | null;
  isLoading: boolean;
  addEntry: (inputs: CalculatorInputs, emissions: EmissionBreakdown, ecoScore: EcoScore) => WeeklyEntry;
  clearData: () => void;
  updateData: (updater: (prev: UserData) => UserData) => void;
  importData: (jsonString: string) => ImportResult;
  exportData: () => { success: boolean; error?: string };
} {
  const [data, setData] = useState<UserData | null>(null);
  const [quota, setQuota] = useState<StorageUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshQuota = useCallback((): void => {
    setQuota(getLocalStorageUsage());
  }, []);

  useEffect((): (() => void) => {
    const timer = setTimeout((): void => {
      const userData = loadUserData();
      setData(userData);
      setQuota(getLocalStorageUsage());
      setIsLoading(false);
    }, 0);
    return (): void => clearTimeout(timer);
  }, []);

  const addEntry = useCallback(
    (inputs: CalculatorInputs, emissions: EmissionBreakdown, ecoScore: EcoScore): WeeklyEntry => {
      const entry = addEntryToStorage(inputs, emissions, ecoScore);
      setData(loadUserData());
      refreshQuota();
      return entry;
    },
    [refreshQuota]
  );

  const clearData = useCallback((): void => {
    clearAllData();
    setData(loadUserData());
    refreshQuota();
  }, [refreshQuota]);

  const updateData = useCallback((updater: (prev: UserData) => UserData): void => {
    setData((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveUserData(next);
      refreshQuota();
      return next;
    });
  }, [refreshQuota]);

  const importData = useCallback((jsonString: string) => {
    const result = importUserData(jsonString);
    if (result.success) {
      setData(loadUserData());
      refreshQuota();
    }
    return result;
  }, [refreshQuota]);

  const exportData = useCallback(() => {
    return exportUserData();
  }, []);

  return {
    data,
    quota,
    isLoading,
    addEntry,
    clearData,
    updateData,
    importData,
    exportData,
  };
}
