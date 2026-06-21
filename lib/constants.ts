import type { DietType, TransportMode } from '@/types';

/**
 * CarbonTrack Constants
 * Contains all static values, thresholds, emission factors, and configuration settings.
 */

/**
 * Emission factors used to calculate carbon footprints.
 * Values represent kg CO2 produced per unit.
 */
export const EMISSION_FACTORS = {
  transport: {
    car: 0.21,    // kg CO2 per km
    bike: 0.0,    // kg CO2 per km
    public: 0.089, // kg CO2 per km
  },
  energy: {
    electricity: 0.42, // kg CO2 per kWh (global avg)
  },
  diet: {
    vegetarian: 3.8,      // kg CO2 per day
    mixed: 5.6,           // kg CO2 per day
    'non-vegetarian': 7.2, // kg CO2 per day
  },
} as const;

/**
 * Global average annual carbon emissions per capita in kg CO2.
 * Equal to ~4.7 tonnes.
 */
export const GLOBAL_AVG_ANNUAL = 4700;

/**
 * National carbon emission averages per capita per year in kg CO2.
 */
export const COUNTRY_AVERAGES = [
  { code: 'US', name: 'United States', annualPerCapita: 14500 },
  { code: 'DE', name: 'Germany', annualPerCapita: 7700 },
  { code: 'CN', name: 'China', annualPerCapita: 7600 },
  { code: 'UK', name: 'United Kingdom', annualPerCapita: 4700 },
  { code: 'IN', name: 'India', annualPerCapita: 1900 },
  { code: 'GL', name: 'Global Average', annualPerCapita: 4700 },
] as const;

/**
 * Eco-score letter grade boundaries and display labels.
 */
export const ECO_SCORE_THRESHOLDS = {
  A: { min: 80, label: 'Excellent', color: '#2d8a4e' },
  B: { min: 60, label: 'Good', color: '#5b9a3a' },
  C: { min: 40, label: 'Average', color: '#d4a84b' },
  D: { min: 20, label: 'Below Average', color: '#c4853a' },
  F: { min: 0, label: 'Poor', color: '#c4443a' },
} as const;

/**
 * Valid options for weekly transportation modes.
 */
export const VALID_TRANSPORT_MODES = ['car', 'bike', 'public'] as const;

/**
 * Valid options for user dietary types.
 */
export const VALID_DIET_TYPES = ['vegetarian', 'mixed', 'non-vegetarian'] as const;

/**
 * Weekly transportation options for input selector displays.
 */
export const TRANSPORT_MODES = [
  { value: 'car' as const, label: 'Car', icon: '🚗', description: 'Personal vehicle' },
  { value: 'bike' as const, label: 'Bicycle', icon: '🚲', description: 'Zero emission' },
  { value: 'public' as const, label: 'Public Transit', icon: '🚌', description: 'Bus, metro, train' },
];

/**
 * Dietary options for input selector displays.
 */
export const DIET_TYPES = [
  { value: 'vegetarian' as const, label: 'Vegetarian', icon: '🥬', description: 'Plant-based diet' },
  { value: 'mixed' as const, label: 'Mixed', icon: '🍽️', description: 'Balanced diet' },
  { value: 'non-vegetarian' as const, label: 'Non-Vegetarian', icon: '🥩', description: 'Meat-heavy diet' },
];

/**
 * Hex colors mapped to footprint categories for charts and icons.
 */
export const CATEGORY_COLORS = {
  transport: '#4a90a8',
  energy: '#d4a84b',
  diet: '#c4653a',
} as const;

/**
 * Emojis mapped to footprint categories.
 */
export const CATEGORY_ICONS = {
  transport: '🚗',
  energy: '⚡',
  diet: '🥗',
  general: '🌍',
} as const;

/**
 * localStorage storage key for persisting dashboard state.
 */
export const STORAGE_KEY = 'carbon-footprint-data';

/** Number of weeks in a month (approximate). */
export const WEEKS_PER_MONTH = 4.33;

/** Number of weeks in a year. */
export const WEEKS_PER_YEAR = 52;

/** Maximum stored entries (10 years of weekly data). */
export const MAX_STORED_ENTRIES = 520;

/** localStorage size limit in bytes (5 MB). */
export const LOCAL_STORAGE_MAX_BYTES = 5 * 1024 * 1024;

/** Storage warning threshold percentage. */
export const STORAGE_WARNING_THRESHOLD = 80;

/**
 * Type guard to check if a value is a valid DietType.
 */
export function isValidDietType(value: string): value is DietType {
  return (VALID_DIET_TYPES as readonly string[]).includes(value);
}

/**
 * Type guard to check if a value is a valid TransportMode.
 */
export function isValidTransportMode(value: string): value is TransportMode {
  return (VALID_TRANSPORT_MODES as readonly string[]).includes(value);
}

/**
 * Get eco-score grade CSS class based on the score value.
 */
export function getGradeColorClass(score: number): string {
  if (score >= 80) return 'bg-eco-a/10 text-eco-a';
  if (score >= 60) return 'bg-eco-b/10 text-eco-b';
  if (score >= 40) return 'bg-eco-c/10 text-eco-c';
  if (score >= 20) return 'bg-eco-d/10 text-eco-d';
  return 'bg-eco-f/10 text-eco-f';
}

/** Carbon offset equivalent factors. */
export const EQUIVALENCY_FACTORS = {
  treesYear: 22,
  drivingKm: 0.20,
  flightKm: 0.115,
  lightbulbHours: 0.024,
} as const;
