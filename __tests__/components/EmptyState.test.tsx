import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/EmptyState';

describe('EmptyState component', () => {
  test('renders title and description correctly', () => {
    render(<EmptyState title="No entries found" description="Try adding some data." />);
    expect(screen.getByText('No entries found')).toBeInTheDocument();
    expect(screen.getByText('Try adding some data.')).toBeInTheDocument();
  });

  test('renders custom icon when provided', () => {
    render(
      <EmptyState
        title="Custom Title"
        description="Description"
        icon={<span data-testid="custom-icon">🔍</span>}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
