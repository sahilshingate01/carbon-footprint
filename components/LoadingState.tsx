import { Leaf } from 'lucide-react';

interface LoadingStateProps {
  /**
   * The message text shown underneath the loading spinner. Defaults to 'Loading...'.
   */
  message?: string;
}

/**
 * LoadingState component displaying an animated spinner and leaf icon.
 * Includes status and polite live aria attributes for accessibility.
 */
export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in" id="loading-state" role="status" aria-live="polite">
      <div className="relative mb-4">
        <div className="h-12 w-12 rounded-full border-2 border-hairline border-t-brand-blue animate-spin" />
        <Leaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-brand-blue" />
      </div>
      <p className="text-sm text-mute">{message}</p>
    </div>
  );
}
