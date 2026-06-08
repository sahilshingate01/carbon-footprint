'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import type { ReductionPlanDay } from '@/types';

interface ReductionPlanProps {
  plan: ReductionPlanDay[];
}

const catBg: Record<string, string> = {
  transport: 'bg-cat-transport/10 text-cat-transport',
  energy: 'bg-cat-energy/10 text-cat-energy',
  diet: 'bg-cat-diet/10 text-cat-diet',
  general: 'bg-brand-blue/10 text-brand-blue',
};

export default function ReductionPlan({ plan }: ReductionPlanProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? plan : plan.slice(0, 7);

  return (
    <div id="reduction-plan">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-brand-blue" />
        <h3 className="text-base font-semibold text-ink tracking-tight">30-Day Reduction Plan</h3>
      </div>

      <div className="space-y-2">
        {visible.map((day) => (
          <div
            key={day.day}
            className="card-soft rounded-lg p-3 flex items-start gap-3 transition-all duration-200 hover:border-hairline-strong animate-slide-up"
            style={{ animationDelay: `${day.day * 30}ms` }}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-3 text-xs font-mono font-medium text-mute">
              {day.day}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-ink">{day.task}</p>
                <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${catBg[day.category]}`}>
                  {day.category}
                </span>
              </div>
              <p className="text-xs text-mute leading-relaxed">{day.tip}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
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
}
