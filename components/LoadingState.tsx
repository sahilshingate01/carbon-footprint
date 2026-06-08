import { Leaf } from 'lucide-react';

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in" id="loading-state">
      <div className="relative mb-4">
        <div className="h-12 w-12 rounded-full border-2 border-hairline border-t-brand-blue animate-spin" />
        <Leaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-brand-blue" />
      </div>
      <p className="text-sm text-mute">{message}</p>
    </div>
  );
}

export function EmptyState({ title, description, icon }: { title: string; description: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in" id="empty-state">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-3 mb-4">
        {icon || <Leaf className="h-7 w-7 text-mute" />}
      </div>
      <h3 className="text-base font-semibold text-ink mb-1.5 tracking-tight">{title}</h3>
      <p className="text-sm text-mute max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}
