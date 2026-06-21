import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SuggestionCard, { AIInsightsBanner } from '../SuggestionCard';
import type { AISuggestion } from '@/types';

const mockSuggestion: AISuggestion = {
  id: 'test-suggestion',
  category: 'energy',
  title: 'Unplug devices',
  description: 'Unplug devices to save phantom power.',
  impact: 'medium',
  savingsKg: 5.4,
};

describe('SuggestionCard and AIInsightsBanner components', () => {
  test('renders suggestion title, description, savings, and impact badge', () => {
    render(<SuggestionCard suggestion={mockSuggestion} index={0} />);
    
    expect(screen.getByText('Unplug devices')).toBeInTheDocument();
    expect(screen.getByText('Unplug devices to save phantom power.')).toBeInTheDocument();
    expect(screen.getByText('5.4 kg CO₂/week')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  test('calls onToggleComplete when checkbox is checked', () => {
    const toggleSpy = vi.fn();
    render(
      <SuggestionCard
        suggestion={mockSuggestion}
        index={0}
        onToggleComplete={toggleSpy}
        isCompleted={false}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /Mark "Unplug devices" as completed/i });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(toggleSpy).toHaveBeenCalled();
  });

  test('renders completed suggestions with proper styles', () => {
    render(
      <SuggestionCard
        suggestion={mockSuggestion}
        index={0}
        isCompleted={true}
        onToggleComplete={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /Mark "Unplug devices" as completed/i });
    expect(checkbox).toBeChecked();
  });

  test('AIInsightsBanner renders potential savings correctly', () => {
    render(<AIInsightsBanner totalSavings={15.8} />);
    expect(screen.getByText(/Follow all suggestions to reduce weekly emissions by up to/i).textContent).toContain('15.8 kg CO₂');
  });
});
