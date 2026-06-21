import { Leaf } from 'lucide-react';

interface EmptyStateProps {
  /**
   * Title text explaining why there is no content.
   */
  title: string;
  /**
   * Descriptive text suggesting actions to generate content.
   */
  description: string;
  /**
   * Optional custom icon to display above the title. Defaults to a Leaf icon.
   */
  icon?: React.ReactNode;
}

/**
 * EmptyState component displayed when a dashboard or list has no entries/data.
 * Aligned with the warm light/earthy theme.
 */
export default function EmptyState({ title, description, icon }: EmptyStateProps) {
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
