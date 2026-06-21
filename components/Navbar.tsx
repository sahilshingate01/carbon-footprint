'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/learn', label: 'Learn' },
];

/**
 * Navbar component for root navigation.
 * Features a sticky glassmorphism container, brand logo, navigation links,
 * and a mobile menu drawer toggle.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      id="main-nav"
      aria-label="Main navigation"
      className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-hairline bg-surface-0/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          prefetch={true}
          className="flex items-center gap-2 text-ink transition-opacity hover:opacity-80"
          id="nav-logo"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/10">
            <Leaf className="h-4 w-4 text-brand-blue" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            CarbonTrack
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              id={`nav-${link.label.toLowerCase()}`}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                pathname === link.href
                  ? 'bg-brand-blue/8 text-brand-blue font-medium'
                  : 'text-body hover:text-ink hover:bg-hairline/40'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/calculator"
            prefetch={true}
            id="nav-cta"
            className="inline-flex h-8 items-center rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-ink/80"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-body transition-colors hover:text-ink sm:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          id="nav-mobile-toggle"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b border-hairline bg-surface-0/95 backdrop-blur-xl sm:hidden animate-fade-in">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                onClick={() => setMobileOpen(false)}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  pathname === link.href
                    ? 'bg-brand-blue/8 text-brand-blue font-medium'
                    : 'text-body hover:text-ink hover:bg-hairline/40'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/calculator"
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-ink/80"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
