import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorResults from '../CalculatorResults';
import type { CalculatorInputs, EmissionBreakdown, EcoScore } from '@/types';

// Mock next/navigation
const pushSpy = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushSpy,
  }),
}));

const mockInputs: CalculatorInputs = {
  transport: { mode: 'car', distancePerWeek: 100 },
  energy: { monthlyElectricity: 200 },
  diet: { type: 'mixed' },
};

const mockResults = {
  emissions: {
    transport: 21,
    energy: 19.4,
    diet: 39.2,
    total: 79.6,
  } as EmissionBreakdown,
  ecoScore: {
    score: 56,
    grade: 'C' as const,
    label: 'Average',
  } as EcoScore,
};

describe('CalculatorResults component', () => {
  test('renders calculated score and stats cards correctly', () => {
    render(
      <CalculatorResults
        inputs={mockInputs}
        results={mockResults}
        quota={null}
        onReset={() => {}}
        updateData={() => {}}
      />
    );

    // Eco Score grade
    expect(screen.getByText('C')).toBeInTheDocument();
    
    // Stats cards
    expect(screen.getByText('Weekly Emissions')).toBeInTheDocument();
    expect(screen.getByText('79.6')).toBeInTheDocument();
  });

  test('calls onReset when Recalculate button is clicked', () => {
    const resetSpy = vi.fn();
    render(
      <CalculatorResults
        inputs={mockInputs}
        results={mockResults}
        quota={null}
        onReset={resetSpy}
        updateData={() => {}}
      />
    );

    const recalculateBtn = screen.getByRole('button', { name: /Recalculate your carbon footprint/i });
    fireEvent.click(recalculateBtn);

    expect(resetSpy).toHaveBeenCalled();
  });

  test('navigates to dashboard when Dashboard button is clicked', () => {
    render(
      <CalculatorResults
        inputs={mockInputs}
        results={mockResults}
        quota={null}
        onReset={() => {}}
        updateData={() => {}}
      />
    );

    const dashboardBtn = screen.getByRole('button', { name: /Go to emissions dashboard/i });
    fireEvent.click(dashboardBtn);

    expect(pushSpy).toHaveBeenCalledWith('/dashboard');
  });

  test('toggles suggestions and updates user data state (both add and remove)', () => {
    let mockState = {
      completedSuggestions: ['switch-public']
    };
    const updateSpy = vi.fn((updater) => {
      mockState = updater(mockState);
    });

    const { rerender } = render(
      <CalculatorResults
        inputs={mockInputs}
        results={mockResults}
        quota={null}
        onReset={() => {}}
        updateData={updateSpy}
        completedSuggestions={mockState.completedSuggestions}
      />
    );

    // Toggle OFF (it was already in completedSuggestions)
    const activeCheckboxes = screen.getAllByRole('checkbox');
    fireEvent.click(activeCheckboxes[0]);
    expect(updateSpy).toHaveBeenCalled();
    expect(mockState.completedSuggestions).not.toContain('switch-public');

    // Reset spy & mock state to toggle ON
    updateSpy.mockClear();
    mockState = { completedSuggestions: [] };
    
    rerender(
      <CalculatorResults
        inputs={mockInputs}
        results={mockResults}
        quota={null}
        onReset={() => {}}
        updateData={updateSpy}
        completedSuggestions={mockState.completedSuggestions}
      />
    );

    const newCheckboxes = screen.getAllByRole('checkbox');
    fireEvent.click(newCheckboxes[0]);
    expect(updateSpy).toHaveBeenCalled();
    expect(mockState.completedSuggestions.length).toBeGreaterThan(0);
  });

  test('toggles reduction plan days and updates user data state (both add and remove)', () => {
    let mockState = {
      completedPlanDays: [1]
    };
    const updateSpy = vi.fn((updater) => {
      mockState = updater(mockState);
    });

    const { rerender } = render(
      <CalculatorResults
        inputs={mockInputs}
        results={mockResults}
        quota={null}
        onReset={() => {}}
        updateData={updateSpy}
        completedPlanDays={mockState.completedPlanDays}
      />
    );

    // Toggle OFF
    const dayCheckboxes = screen.getAllByRole('checkbox', { name: /Mark Day/i });
    fireEvent.click(dayCheckboxes[0]);
    expect(updateSpy).toHaveBeenCalled();
    expect(mockState.completedPlanDays).not.toContain(1);

    // Reset spy & mock state to toggle ON
    updateSpy.mockClear();
    mockState = { completedPlanDays: [] };

    rerender(
      <CalculatorResults
        inputs={mockInputs}
        results={mockResults}
        quota={null}
        onReset={() => {}}
        updateData={updateSpy}
        completedPlanDays={mockState.completedPlanDays}
      />
    );

    const newDayCheckboxes = screen.getAllByRole('checkbox', { name: /Mark Day/i });
    fireEvent.click(newDayCheckboxes[0]);
    expect(updateSpy).toHaveBeenCalled();
    expect(mockState.completedPlanDays).toContain(1);
  });

  test('renders storage warning banner when approaching limit', () => {
    render(
      <CalculatorResults
        inputs={mockInputs}
        results={mockResults}
        quota={{ usedBytes: 8000, totalBytes: 10000, percentage: 80, isApproachingLimit: true }}
        onReset={() => {}}
        updateData={() => {}}
      />
    );

    expect(screen.getByText(/Storage Warning:/i)).toBeInTheDocument();
    expect(screen.getByText(/approaching your browser's storage limit/i)).toBeInTheDocument();
  });

  test('renders more than 4 suggestions and is able to toggle them', () => {
    const richInputs: CalculatorInputs = {
      transport: { mode: 'car', distancePerWeek: 150 },
      energy: { monthlyElectricity: 400 },
      diet: { type: 'non-vegetarian' },
    };
    const richResults = {
      emissions: {
        transport: 50,
        energy: 60,
        diet: 40,
        total: 150,
      } as EmissionBreakdown,
      ecoScore: {
        score: 30,
        grade: 'D' as const,
        label: 'Poor',
      } as EcoScore,
    };

    let mockState = { completedSuggestions: [] as string[] };
    const updateSpy = vi.fn((updater) => {
      mockState = updater(mockState);
    });

    render(
      <CalculatorResults
        inputs={richInputs}
        results={richResults}
        quota={null}
        onReset={() => {}}
        updateData={updateSpy}
        completedSuggestions={mockState.completedSuggestions}
      />
    );

    // Should display "More Suggestions" title
    expect(screen.getByText('More Suggestions')).toBeInTheDocument();

    // Find and click one of the additional suggestions (which are at index >= 4)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(4);
    
    // Toggle the 5th suggestion (index 4)
    fireEvent.click(checkboxes[4]);
    expect(updateSpy).toHaveBeenCalled();
  });
});
