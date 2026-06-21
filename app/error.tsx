'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in" id="error-boundary">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-pink/10 mb-6 animate-pulse-glow">
        <AlertTriangle className="h-8 w-8 text-brand-pink" />
      </div>
      
      <span className="font-mono text-xs uppercase tracking-wider text-brand-pink mb-2">
        Application Error
      </span>
      
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl max-w-md">
        Something went wrong.
      </h1>
      
      <p className="mt-4 text-sm text-body max-w-sm leading-relaxed">
        An unexpected error occurred while processing your request. Please try again or return home.
      </p>

      {error.message && (
        <pre className="mt-4 p-3 bg-surface-1 border border-hairline rounded-lg text-xs font-mono text-mute max-w-lg overflow-auto max-h-32 text-left">
          {error.message}
        </pre>
      )}

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-white transition-all hover:bg-ink/80 hover:scale-[1.02] active:scale-[0.98]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-5 text-sm text-body transition-all hover:bg-surface-1 hover:text-ink"
        >
          <Home className="h-3.5 w-3.5" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
