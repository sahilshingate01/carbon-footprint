'use client';

import { useState, memo } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import type { ReductionPlanDay } from '@/types';

interface ReductionPlanProps {
  /**
   * The list of day-by-day reduction tasks (usually 30 days).
   */
  plan: ReductionPlanDay[];
  /**
   * List of day numbers that have been completed.
   */
  completedDays?: number[];
  /**
   * Callback triggered when a day completion is toggled.
   */
  onToggleDay?: (dayNumber: number) => void;
}

const catBg: Record<string, string> = {
  transport: 'bg-cat-transport/10 text-cat-transport',
  energy: 'bg-cat-energy/10 text-cat-energy',
  diet: 'bg-cat-diet/10 text-cat-diet',
  general: 'bg-brand-blue/10 text-brand-blue',
};

/**
 * ReductionPlan component displays a step-by-step program to gradually
 * decrease carbon footprint emissions over a 30-day period.
 * Shows the first 7 days initially and allows expanding to view the full plan.
 */
export default memo(function ReductionPlan({ plan, completedDays = [], onToggleDay }: ReductionPlanProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? plan : plan.slice(0, 7);

  const completedCount = completedDays.length;
  const totalCount = plan.length || 30;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <div id="reduction-plan">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand-blue" />
          <h3 className="text-base font-semibold text-ink tracking-tight">30-Day Reduction Plan</h3>
        </div>
        {onToggleDay && totalCount > 0 && (
          <div className="flex items-center gap-3 w-full sm:w-auto max-w-xs shrink-0">
            <span className="text-xs text-mute font-medium whitespace-nowrap">
              {completedCount}/{totalCount} days ({percentComplete}%)
            </span>
            <div className="h-1.5 flex-1 rounded-full bg-hairline overflow-hidden min-w-[80px]">
              <div
                className="h-full bg-brand-blue transition-all duration-300 rounded-full"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {visible.map((day) => {
          const isDone = completedDays.includes(day.day);
          return (
            <div
              key={day.day}
              className={`card-soft rounded-lg p-3 flex items-start gap-3 transition-all duration-200 hover:border-hairline-strong animate-slide-up ${
                isDone ? 'border-success/40 bg-success/5 opacity-85' : ''
              }`}
              style={{ animationDelay: `${day.day * 20}ms` }}
            >
              {onToggleDay ? (
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggleDay(day.day)}
                  className="mt-1 h-4 w-4 rounded border-hairline text-brand-blue focus:ring-brand-blue cursor-pointer shrink-0"
                  aria-label={`Mark Day ${day.day} task as completed`}
                />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-3 text-xs font-mono font-medium text-mute">
                  {day.day}
                </div>
              )}
              {onToggleDay && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-3 text-xs font-mono font-medium text-mute">
                  {day.day}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-medium ${isDone ? 'text-ink/65 line-through' : 'text-ink'}`}>
                    {day.task}
                  </p>
                  <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${catBg[day.category]}`}>
                    {day.category}
                  </span>
                </div>
                <p className="text-xs text-mute leading-relaxed">{day.tip}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="mt-3 flex items-center gap-1 text-sm text-brand-blue hover:text-brand-cyan transition-colors"
      >
        {expanded ? (
          <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
        ) : (
          <>Show all 30 days <ChevronDown className="h-3.5 w-3.5" /></>
        )}
      </button>
    </div>
  );
});
