import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import EmissionTrendChart from '../EmissionTrendChart';
import type { WeeklyEntry } from '@/types';

vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts') as Record<string, unknown>;
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

const mockEntries: WeeklyEntry[] = [
  {
    id: '1',
    date: '2026-01-01',
    weekNumber: 1,
    inputs: {
      transport: { mode: 'car', distancePerWeek: 100 },
      energy: { monthlyElectricity: 200 },
      diet: { type: 'mixed' }
    },
    emissions: { transport: 21, energy: 19.4, diet: 39.2, total: 79.6 },
    ecoScore: { score: 56, grade: 'C', label: 'Average' }
  }
];

describe('EmissionTrendChart component', () => {
  test('renders empty message when no entries are present', () => {
    render(<EmissionTrendChart entries={[]} />);
    expect(screen.getByText('No trend data yet. Start tracking to see your progress.')).toBeInTheDocument();
  });

  test('renders trend chart details for screen readers', () => {
    render(<EmissionTrendChart entries={mockEntries} />);
    expect(screen.getByText('Weekly emissions trend over time')).toBeInTheDocument();
    expect(screen.getByText('W1')).toBeInTheDocument();
    expect(screen.getByText('79.6 kg')).toBeInTheDocument();
  });
});
