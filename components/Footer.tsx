import { Leaf, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      id="main-footer"
      className="border-t border-hairline bg-surface-0"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/10">
                <Leaf className="h-4 w-4 text-brand-blue" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-ink">
                CarbonTrack
              </span>
            </div>
            <p className="text-sm text-mute leading-relaxed">
              Track, reduce, and offset your carbon footprint with data-driven
              insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-mute">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/calculator" className="text-sm text-body transition-colors hover:text-ink">
                  Calculator
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-body transition-colors hover:text-ink">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-mute">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-body">
                  Carbon Offsets
                </span>
              </li>
              <li>
                <span className="text-sm text-body">
                  Eco Tips
                </span>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-mute">
              Connect
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-body transition-colors hover:text-ink"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-hairline pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-mute">
            © {new Date().getFullYear()} CarbonTrack. Built for a greener future.
          </p>
          <p className="text-xs text-mute">
            Data for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
