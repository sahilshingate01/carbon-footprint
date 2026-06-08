'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      id="main-nav"
      className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-hairline bg-surface-1/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
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
              id={`nav-${link.label.toLowerCase()}`}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                pathname === link.href
                  ? 'bg-surface-3 text-ink font-medium'
                  : 'text-body hover:text-ink hover:bg-surface-3/50'
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
            id="nav-cta"
            className="inline-flex h-8 items-center rounded-full bg-ink px-4 text-sm font-medium text-surface-0 transition-colors hover:bg-white"
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
          id="nav-mobile-toggle"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b border-hairline bg-surface-1/95 backdrop-blur-xl sm:hidden animate-fade-in">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  pathname === link.href
                    ? 'bg-surface-3 text-ink font-medium'
                    : 'text-body hover:text-ink hover:bg-surface-3/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/calculator"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-ink px-4 text-sm font-medium text-surface-0 transition-colors hover:bg-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
