// Carbon Footprint Types

export interface TransportData {
  mode: 'car' | 'bike' | 'public';
  distancePerWeek: number; // km
}

export interface EnergyData {
  monthlyElectricity: number; // kWh
}

export type DietType = 'vegetarian' | 'mixed' | 'non-vegetarian';

export interface DietData {
  type: DietType;
}

export interface CalculatorInputs {
  transport: TransportData;
  energy: EnergyData;
  diet: DietData;
}

export interface EmissionBreakdown {
  transport: number;
  energy: number;
  diet: number;
  total: number;
}

export interface EcoScore {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  label: string;
}

export interface WeeklyEntry {
  id: string;
  date: string; // ISO string
  weekNumber: number;
  inputs: CalculatorInputs;
  emissions: EmissionBreakdown;
  ecoScore: EcoScore;
}

export interface MonthlyAggregate {
  month: string; // "Jan 2024"
  totalEmissions: number;
  avgEcoScore: number;
  entries: number;
  breakdown: EmissionBreakdown;
}

export interface AISuggestion {
  id: string;
  category: 'transport' | 'energy' | 'diet' | 'general';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  savingsKg: number;
}

export interface ReductionPlanDay {
  day: number;
  task: string;
  category: 'transport' | 'energy' | 'diet' | 'general';
  tip: string;
}

export interface UserData {
  entries: WeeklyEntry[];
  lastCalculation: CalculatorInputs | null;
  createdAt: string;
  weeklyGoal?: number | null; // weekly emissions target in kg CO2
  completedSuggestions?: string[]; // IDs of completed suggestions
  completedPlanDays?: number[]; // day numbers (1-30) of completed reduction plan tasks
}
