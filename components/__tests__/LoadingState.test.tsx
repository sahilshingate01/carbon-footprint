import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingState from '../LoadingState';

describe('LoadingState component', () => {
  test('renders with default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    render(<LoadingState message="Fetching carbon data..." />);
    expect(screen.getByText('Fetching carbon data...')).toBeInTheDocument();
  });
});
