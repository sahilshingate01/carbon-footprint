import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RegionalComparison from '@/components/RegionalComparison';

describe('RegionalComparison component', () => {
  test('renders user annualized footprint details and country selector', () => {
    // 5200 kg CO2 = 5.2 tonnes
    render(<RegionalComparison annual={5200} />);

    expect(screen.getByText('Your Footprint (Annualized)')).toBeInTheDocument();
    expect(screen.getByText('5.2 tonnes CO₂/yr')).toBeInTheDocument();
    
    const selector = screen.getByRole('combobox', { name: /Select Country/i });
    expect(selector).toBeInTheDocument();
  });

  test('compares footprint correctly against global average', () => {
    // 5.2 tonnes is higher than global average of 4.7 tonnes
    render(<RegionalComparison annual={5200} />);
    
    expect(screen.getByText(/Your carbon footprint is 11% higher than the average in Global Average/i)).toBeInTheDocument();
  });

  test('compares footprint correctly against selected country averages', () => {
    // 5.2 tonnes is lower than US average of 14.5 tonnes
    render(<RegionalComparison annual={5200} />);

    const selector = screen.getByRole('combobox', { name: /Select Country/i });
    fireEvent.change(selector, { target: { value: 'US' } });

    expect(screen.getByText(/Your carbon footprint is 64% lower than the average in United States/i)).toBeInTheDocument();
  });

  test('compares footprint correctly when it matches the average exactly', () => {
    // 4700 kg matches GL (Global Average) which is 4700 kg
    render(<RegionalComparison annual={4700} />);
    expect(screen.getByText('Your footprint matches the national average for Global Average.')).toBeInTheDocument();
  });

  test('falls back to default country when select value is unrecognized', () => {
    render(<RegionalComparison annual={5200} />);
    const selector = screen.getByRole('combobox', { name: /Select Country/i });
    
    // Change to unrecognized country code
    fireEvent.change(selector, { target: { value: 'XX' } });
    
    // It should fallback to index 5 (GL - Global Average), which is 4.7 tonnes
    // 5.2 tonnes is 11% higher than 4.7 tonnes
    expect(screen.getByText(/Your carbon footprint is 11% higher than the average in Global Average/i)).toBeInTheDocument();
  });
});
