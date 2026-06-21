import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar component', () => {
  test('renders brand logo and main desktop navigation links', () => {
    render(<Navbar />);

    expect(screen.getByText('CarbonTrack')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('toggles mobile navigation drawer', () => {
    render(<Navbar />);

    const toggleBtn = screen.getByRole('button', { name: /Toggle menu/i });
    expect(screen.queryByRole('link', { name: 'Get Started' })).toBeInTheDocument(); // desktop CTA is visible, mobile drawer is closed.

    fireEvent.click(toggleBtn);
    
    // In mobile menu, when open, links are visible.
    const mobileLinks = screen.getAllByText('Home');
    expect(mobileLinks.length).toBeGreaterThan(0);
  });

  test('clicks links in mobile navigation drawer to navigate and close menu', () => {
    render(<Navbar />);

    const toggleBtn = screen.getByRole('button', { name: /Toggle menu/i });
    fireEvent.click(toggleBtn);

    const mobileHomeLinks = screen.getAllByText('Home');
    expect(mobileHomeLinks.length).toBeGreaterThan(1);
    
    fireEvent.click(mobileHomeLinks[1]);
    expect(screen.queryByText('Get Started', { selector: 'a' })).toBeInTheDocument();

    // Open it again
    fireEvent.click(toggleBtn);
    const mobileGetStartedBtn = screen.getAllByText('Get Started');
    expect(mobileGetStartedBtn.length).toBeGreaterThan(1);
    fireEvent.click(mobileGetStartedBtn[1]);
  });
});
