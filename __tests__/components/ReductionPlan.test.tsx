import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReductionPlan from '@/components/ReductionPlan';
import type { ReductionPlanDay } from '@/types';

const mockPlan: ReductionPlanDay[] = [
  { day: 1, task: 'Audit emissions', category: 'general', tip: 'Audit tip' },
  { day: 2, task: 'Switch LEDs', category: 'energy', tip: 'LED tip' },
  { day: 3, task: 'Walk to school', category: 'transport', tip: 'Walk tip' },
  { day: 4, task: 'Eat veggies', category: 'diet', tip: 'Eat tip' },
  { day: 5, task: 'Turn off PC', category: 'energy', tip: 'PC tip' },
  { day: 6, task: 'Compost scraps', category: 'diet', tip: 'Compost tip' },
  { day: 7, task: 'Reflect progress', category: 'general', tip: 'Reflect tip' },
  { day: 8, task: 'Bike commute', category: 'transport', tip: 'Bike tip' },
];

describe('ReductionPlan component', () => {
  test('renders initial 7 days of the plan', () => {
    render(<ReductionPlan plan={mockPlan} completedDays={[]} />);

    expect(screen.getByText('Audit emissions')).toBeInTheDocument();
    expect(screen.getByText('Reflect progress')).toBeInTheDocument();
    expect(screen.queryByText('Bike commute')).not.toBeInTheDocument(); // day 8 is initially hidden
  });

  test('toggles expansion to show full plan', () => {
    render(<ReductionPlan plan={mockPlan} completedDays={[]} />);

    const expandBtn = screen.getByRole('button', { name: /Show all 30 days/i });
    fireEvent.click(expandBtn);

    expect(screen.getByText('Bike commute')).toBeInTheDocument(); // Day 8 is now visible
    expect(screen.getByRole('button', { name: /Show less/i })).toBeInTheDocument();
  });

  test('reports completed days percentage and triggers callback when item is clicked', () => {
    const toggleSpy = vi.fn();
    render(
      <ReductionPlan
        plan={mockPlan}
        completedDays={[1, 2]}
        onToggleDay={toggleSpy}
      />
    );

    // 2 completed out of 8 days = 25%
    expect(screen.getByText('2/8 days (25%)')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', { name: /Mark Day 3 task as completed/i });
    fireEvent.click(checkbox);

    expect(toggleSpy).toHaveBeenCalledWith(3);
  });

  test('falls back correctly when plan is empty', () => {
    render(<ReductionPlan plan={[]} completedDays={[1, 2]} onToggleDay={() => {}} />);
    expect(screen.getByText('2/30 days (7%)')).toBeInTheDocument();
  });
});
