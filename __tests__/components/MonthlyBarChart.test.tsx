import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import type { MonthlyAggregate } from '@/types';

vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts') as Record<string, unknown>;
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

const mockData: MonthlyAggregate[] = [
  {
    month: 'Jan 2026',
    totalEmissions: 60,
    avgEcoScore: 80,
    entries: 1,
    breakdown: { transport: 10, energy: 20, diet: 30, total: 60 }
  }
];

describe('MonthlyBarChart component', () => {
  test('renders empty message when no monthly data is present', () => {
    render(<MonthlyBarChart data={[]} />);
    expect(screen.getByText('No monthly data yet.')).toBeInTheDocument();
  });

  test('renders monthly comparison table details for screen readers', () => {
    render(<MonthlyBarChart data={mockData} />);
    expect(screen.getByText('Monthly emissions breakdown by category')).toBeInTheDocument();
    expect(screen.getByText('Jan 2026')).toBeInTheDocument();
    expect(screen.getByText('10.0 kg')).toBeInTheDocument();
    expect(screen.getByText('20.0 kg')).toBeInTheDocument();
    expect(screen.getByText('30.0 kg')).toBeInTheDocument();
    expect(screen.getByText('60.0 kg')).toBeInTheDocument();
  });
});
