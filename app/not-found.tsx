import Link from 'next/link';
import { Leaf, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in" id="not-found-page">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10 mb-6 animate-pulse-glow">
        <Leaf className="h-8 w-8 text-brand-blue" />
      </div>
      
      <span className="font-mono text-xs uppercase tracking-wider text-brand-blue mb-2">
        404 - Page Not Found
      </span>
      
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl max-w-md">
        Lost in the wilderness?
      </h1>
      
      <p className="mt-4 text-sm text-body max-w-sm leading-relaxed">
        The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-white transition-all hover:bg-ink/80 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home className="h-3.5 w-3.5" />
          Go Home
        </Link>
        <Link
          href="/calculator"
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-5 text-sm text-body transition-all hover:bg-surface-1 hover:text-ink"
        >
          Calculator
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
