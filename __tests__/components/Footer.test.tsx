import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer component', () => {
  test('renders brand text and copyright details', () => {
    render(<Footer />);
    expect(screen.getByText('CarbonTrack')).toBeInTheDocument();
    expect(screen.getByText(/Built for a greener future/i)).toBeInTheDocument();
    expect(screen.getByText(/Data for educational purposes only/i)).toBeInTheDocument();
  });

  test('renders footer link column headings', () => {
    render(<Footer />);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });
});
