'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserData, CalculatorInputs, EmissionBreakdown, EcoScore } from '@/types';
import { loadUserData, saveUserData, addEntry as addEntryToStorage, clearAllData } from '@/lib/storage';

export function useUserData() {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = loadUserData();
    setData(userData);
    setIsLoading(false);
  }, []);

  const addEntry = useCallback(
    (inputs: CalculatorInputs, emissions: EmissionBreakdown, ecoScore: EcoScore) => {
      const entry = addEntryToStorage(inputs, emissions, ecoScore);
      setData(loadUserData());
      return entry;
    },
    []
  );

  const clearData = useCallback(() => {
    clearAllData();
    setData(loadUserData());
  }, []);

  const updateData = useCallback((updater: (prev: UserData) => UserData) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveUserData(next);
      return next;
    });
  }, []);

  return { data, isLoading, addEntry, clearData, updateData };
}
