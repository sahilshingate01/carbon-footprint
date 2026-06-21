import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import EmissionPieChart from '../EmissionPieChart';

vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts') as Record<string, unknown>;
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

describe('EmissionPieChart component', () => {
  test('renders empty message when no emissions are present', () => {
    render(<EmissionPieChart emissions={{ transport: 0, energy: 0, diet: 0, total: 0 }} />);
    expect(screen.getByText('No emission data to display')).toBeInTheDocument();
  });

  test('renders chart table description for accessibility', () => {
    render(<EmissionPieChart emissions={{ transport: 10, energy: 20, diet: 30, total: 60 }} />);
    expect(screen.getByText('Carbon emissions breakdown by category')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('10.0 kg')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('20.0 kg')).toBeInTheDocument();
  });
});
