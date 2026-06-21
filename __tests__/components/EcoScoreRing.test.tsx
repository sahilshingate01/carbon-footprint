import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import EcoScoreRing from '../EcoScoreRing';
import type { EcoScore } from '@/types';

describe('EcoScoreRing component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders score and label correctly when not animated', () => {
    const ecoScore: EcoScore = {
      score: 85,
      grade: 'A',
      label: 'Excellent'
    };

    render(<EcoScoreRing ecoScore={ecoScore} animated={false} />);
    
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  test('renders animated score transition correctly', () => {
    const ecoScore: EcoScore = {
      score: 72,
      grade: 'B',
      label: 'Good'
    };

    render(<EcoScoreRing ecoScore={ecoScore} animated={true} />);

    // Initially progress is 0
    expect(screen.getByText('0')).toBeInTheDocument();

    // Advance timers past transition timeout
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText('72')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  test('applies correct style color based on grade', () => {
    const ecoScore: EcoScore = {
      score: 15,
      grade: 'F',
      label: 'Poor'
    };

    render(<EcoScoreRing ecoScore={ecoScore} animated={false} />);
    
    act(() => {
      vi.runAllTimers();
    });

    // Check color applied to the score text
    const textSpan = screen.getByText('15');
    expect(textSpan).toHaveStyle({ color: 'rgb(196, 68, 58)' }); // hex #c4443a is rgb(196, 68, 58)
  });

  test('falls back to default color for unrecognized grade', () => {
    const ecoScore = {
      score: 50,
      grade: 'X' as never,
      label: 'Unknown'
    };

    render(<EcoScoreRing ecoScore={ecoScore} animated={false} />);
    
    act(() => {
      vi.runAllTimers();
    });

    const textSpan = screen.getByText('50');
    expect(textSpan).toHaveStyle({ color: '#666' });
  });
});
