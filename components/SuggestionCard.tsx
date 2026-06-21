import type { AISuggestion } from '@/types';
import { CATEGORY_ICONS } from '@/lib/constants';
import { ArrowDown, Sparkles } from 'lucide-react';

interface SuggestionCardProps {
  /**
   * The personalized AI-generated emission reduction suggestion.
   */
  suggestion: AISuggestion;
  /**
   * The index of the card in the list, used to offset animations.
   */
  index: number;
  /**
   * Whether the suggestion has been marked completed by the user.
   */
  isCompleted?: boolean;
  /**
   * Callback function triggered when completion checkbox is toggled.
   */
  onToggleComplete?: () => void;
}

/**
 * SuggestionCard displays a single actionable recommendation to lower emissions.
 * Highlights potential CO₂ savings per week and categorizes suggestion types.
 */
export default function SuggestionCard({
  suggestion,
  index,
  isCompleted = false,
  onToggleComplete,
}: SuggestionCardProps) {
  const impactColors = {
    high: 'text-eco-a bg-eco-a/10 border-eco-a/20',
    medium: 'text-brand-amber bg-brand-amber/10 border-brand-amber/20',
    low: 'text-body bg-surface-3 border-hairline',
  };

  return (
    <div
      className={`card-elevated rounded-xl p-5 transition-all duration-300 hover:border-hairline-strong animate-slide-up group ${
        isCompleted ? 'border-success/40 bg-success/5 opacity-80' : ''
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
      id={`suggestion-${suggestion.id}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {onToggleComplete && (
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={onToggleComplete}
              className="h-4 w-4 rounded border-hairline text-brand-blue focus:ring-brand-blue cursor-pointer"
              aria-label={`Mark "${suggestion.title}" as completed`}
            />
          )}
          <span className="text-lg">{CATEGORY_ICONS[suggestion.category]}</span>
          <h3 className="text-sm font-semibold text-ink tracking-tight">{suggestion.title}</h3>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${impactColors[suggestion.impact]}`}>
          {suggestion.impact}
        </span>
      </div>
      <p className="text-sm text-body leading-relaxed mb-4">{suggestion.description}</p>
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-eco-a">
          <ArrowDown className="h-3 w-3" />
          <span className="font-medium">{suggestion.savingsKg} kg CO₂/week</span>
        </div>
        <span className="text-mute">potential reduction</span>
      </div>
    </div>
  );
}

/**
 * AIInsightsBanner presents a promotional banner summarizing potential cumulative
 * weekly CO₂ savings if all AI-suggested modifications are implemented.
 */
export function AIInsightsBanner({ totalSavings }: { totalSavings: number }) {
  return (
    <div className="card-elevated rounded-xl p-6 glow-blue" id="ai-insights-banner">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue/10">
          <Sparkles className="h-4 w-4 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-ink tracking-tight">AI-Powered Insights</h2>
          <p className="text-xs text-mute">Personalized recommendations based on your data</p>
        </div>
      </div>
      {totalSavings > 0 && (
        <p className="text-sm text-body">
          Follow all suggestions to reduce weekly emissions by up to{' '}
          <span className="font-semibold text-eco-a">{totalSavings.toFixed(1)} kg CO₂</span>.
        </p>
      )}
    </div>
  );
}
