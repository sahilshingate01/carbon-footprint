// Emission factors (kg CO2 per unit)
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

// Average annual emissions per capita (kg CO2)
export const GLOBAL_AVG_ANNUAL = 4700; // ~4.7 tonnes

export const COUNTRY_AVERAGES = [
  { code: 'US', name: 'United States', annualPerCapita: 14500 },
  { code: 'DE', name: 'Germany', annualPerCapita: 7700 },
  { code: 'CN', name: 'China', annualPerCapita: 7600 },
  { code: 'UK', name: 'United Kingdom', annualPerCapita: 4700 },
  { code: 'IN', name: 'India', annualPerCapita: 1900 },
  { code: 'GL', name: 'Global Average', annualPerCapita: 4700 },
] as const;

export const ECO_SCORE_THRESHOLDS = {
  A: { min: 80, label: 'Excellent', color: '#2d8a4e' },
  B: { min: 60, label: 'Good', color: '#5b9a3a' },
  C: { min: 40, label: 'Average', color: '#d4a84b' },
  D: { min: 20, label: 'Below Average', color: '#c4853a' },
  F: { min: 0, label: 'Poor', color: '#c4443a' },
} as const;

export const TRANSPORT_MODES = [
  { value: 'car' as const, label: 'Car', icon: '🚗', description: 'Personal vehicle' },
  { value: 'bike' as const, label: 'Bicycle', icon: '🚲', description: 'Zero emission' },
  { value: 'public' as const, label: 'Public Transit', icon: '🚌', description: 'Bus, metro, train' },
];

export const DIET_TYPES = [
  { value: 'vegetarian' as const, label: 'Vegetarian', icon: '🥬', description: 'Plant-based diet' },
  { value: 'mixed' as const, label: 'Mixed', icon: '🍽️', description: 'Balanced diet' },
  { value: 'non-vegetarian' as const, label: 'Non-Vegetarian', icon: '🥩', description: 'Meat-heavy diet' },
];

export const CATEGORY_COLORS = {
  transport: '#4a90a8',
  energy: '#d4a84b',
  diet: '#c4653a',
} as const;

export const CATEGORY_ICONS = {
  transport: '🚗',
  energy: '⚡',
  diet: '🥗',
  general: '🌍',
} as const;

export const STORAGE_KEY = 'carbon-footprint-data';
