'use client';

import type { WeeklyEntry } from '@/types';
import { getGradeColorClass } from '@/lib/constants';

interface RecentEntriesTableProps {
  entries: WeeklyEntry[];
}

/**
 * RecentEntriesTable renders the list of recent weekly carbon calculations in a semantic table.
 */
export default function RecentEntriesTable({ entries }: RecentEntriesTableProps) {
  return (
    <div className="card-elevated rounded-xl p-6 animate-slide-up" style={{ animationDelay: '160ms' }}>
      <h2 className="text-base font-semibold text-ink tracking-tight mb-4">Recent Entries</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Recent Carbon Footprint Entries">
          <thead>
            <tr className="border-b border-hairline">
              <th scope="col" className="pb-3 text-left font-mono text-xs uppercase tracking-wider text-mute">Date</th>
              <th scope="col" className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Transport</th>
              <th scope="col" className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Energy</th>
              <th scope="col" className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Diet</th>
              <th scope="col" className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Total</th>
              <th scope="col" className="pb-3 text-right font-mono text-xs uppercase tracking-wider text-mute">Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.slice().reverse().map((entry) => (
              <tr key={entry.id} className="border-b border-hairline/50 last:border-0">
                <td className="py-3 text-body">
                  {new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </td>
                <td className="py-3 text-right text-body">{entry.emissions.transport.toFixed(1)}</td>
                <td className="py-3 text-right text-body">{entry.emissions.energy.toFixed(1)}</td>
                <td className="py-3 text-right text-body">{entry.emissions.diet.toFixed(1)}</td>
                <td className="py-3 text-right font-medium text-ink">{entry.emissions.total.toFixed(1)}</td>
                <td className="py-3 text-right">
                  <span className={`inline-flex items-center justify-center h-6 w-8 rounded text-xs font-semibold ${getGradeColorClass(entry.ecoScore.score)}`}>
                    {entry.ecoScore.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
