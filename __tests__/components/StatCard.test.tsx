import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard component', () => {
  test('renders label, value, and unit correctly', () => {
    render(
      <StatCard
        label="Test Category"
        value="123.4"
        unit="kg CO2"
      />
    );

    expect(screen.getByText('Test Category')).toBeInTheDocument(); // label is rendered in mixed-case in DOM (CSS makes it uppercase)
    expect(screen.getByText('123.4')).toBeInTheDocument();
    expect(screen.getByText('kg CO2')).toBeInTheDocument();
  });

  test('renders custom icon when provided', () => {
    render(
      <StatCard
        label="Icon Test"
        value="10"
        icon={<span data-testid="test-icon">⚡</span>}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('renders positive trend correctly (up -> text-error and up arrow)', () => {
    render(
      <StatCard
        label="Emissions"
        value="100"
        trend="up"
        trendValue="15% higher"
      />
    );

    const trendText = screen.getByText('↑ 15% higher');
    expect(trendText).toBeInTheDocument();
    expect(trendText).toHaveClass('text-error');
  });

  test('renders negative trend correctly (down -> text-eco-a and down arrow)', () => {
    render(
      <StatCard
        label="Emissions"
        value="100"
        trend="down"
        trendValue="20% lower"
      />
    );

    const trendText = screen.getByText('↓ 20% lower');
    expect(trendText).toBeInTheDocument();
    expect(trendText).toHaveClass('text-eco-a');
  });

  test('renders neutral trend correctly (neutral -> text-mute and horizontal arrow)', () => {
    render(
      <StatCard
        label="Emissions"
        value="100"
        trend="neutral"
        trendValue="same as last week"
      />
    );

    const trendText = screen.getByText('→ same as last week');
    expect(trendText).toBeInTheDocument();
    expect(trendText).toHaveClass('text-mute');
  });
});
