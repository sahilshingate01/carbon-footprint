'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserData, CalculatorInputs, EmissionBreakdown, EcoScore } from '@/types';
import {
  loadUserData,
  saveUserData,
  addEntry as addEntryToStorage,
  clearAllData,
  getLocalStorageUsage,
  exportUserData,
  importUserData,
  type StorageUsage,
} from '@/lib/storage';

/**
 * Custom React hook that acts as a stateful client wrapper around localStorage storage utilities.
 * Exposes methods to retrieve, add, update, clear, import, and export user data, and track storage quota.
 */
export function useUserData() {
  const [data, setData] = useState<UserData | null>(null);
  const [quota, setQuota] = useState<StorageUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshQuota = useCallback(() => {
    setQuota(getLocalStorageUsage());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const userData = loadUserData();
      setData(userData);
      setQuota(getLocalStorageUsage());
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const addEntry = useCallback(
    (inputs: CalculatorInputs, emissions: EmissionBreakdown, ecoScore: EcoScore) => {
      const entry = addEntryToStorage(inputs, emissions, ecoScore);
      setData(loadUserData());
      refreshQuota();
      return entry;
    },
    [refreshQuota]
  );

  const clearData = useCallback(() => {
    clearAllData();
    setData(loadUserData());
    refreshQuota();
  }, [refreshQuota]);

  const updateData = useCallback((updater: (prev: UserData) => UserData) => {
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
    exportUserData();
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
