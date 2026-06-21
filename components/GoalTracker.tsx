'use client';

import { useState } from 'react';
import { Target, Edit2, Check, X } from 'lucide-react';

interface GoalTrackerProps {
  weeklyGoal: number | null | undefined;
  latestEmissions: number;
  onUpdateGoal: (goal: number | null) => void;
}

export default function GoalTracker({ weeklyGoal, latestEmissions, onUpdateGoal }: GoalTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(weeklyGoal ? weeklyGoal.toString() : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val >= 0) {
      onUpdateGoal(val);
      setIsEditing(false);
    } else if (inputValue === '') {
      onUpdateGoal(null);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue(weeklyGoal ? weeklyGoal.toString() : '');
    setIsEditing(false);
  };

  const hasGoal = weeklyGoal !== null && weeklyGoal !== undefined;
  const goalValue = weeklyGoal || 0;
  const isOverGoal = hasGoal && latestEmissions > goalValue;
  const percentage = hasGoal ? Math.min(Math.round((latestEmissions / goalValue) * 100), 100) : 0;
  const displayPercentage = hasGoal ? Math.round((latestEmissions / goalValue) * 100) : 0;

  return (
    <div className="card-elevated rounded-xl p-6 animate-scale-in" id="goal-tracker">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-brand-blue" />
          <h2 className="text-base font-semibold text-ink tracking-tight">Weekly Carbon Goal</h2>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setInputValue(weeklyGoal ? weeklyGoal.toString() : '');
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1 text-xs text-brand-blue hover:text-brand-cyan transition-colors"
            aria-label="Edit weekly goal"
          >
            <Edit2 className="h-3 w-3" />
            {hasGoal ? 'Change Goal' : 'Set Goal'}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="goal-input" className="block text-xs text-mute font-medium">
            Target emissions (kg CO₂/week)
          </label>
          <div className="flex items-center gap-2">
            <input
              id="goal-input"
              type="number"
              min="1"
              max="10000"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 100"
              className="flex-1 h-9 rounded-md border border-hairline bg-surface-2 px-3 text-sm text-ink outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30"
              required
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-blue text-white hover:bg-brand-blue/80 transition-colors"
              aria-label="Save goal"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-surface-2 text-body hover:bg-surface-2/80 transition-colors"
              aria-label="Cancel editing"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : hasGoal ? (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-body">
              Target: <span className="font-semibold text-ink">{goalValue.toFixed(1)} kg CO₂</span>
            </span>
            <span className="text-xs font-medium text-mute">
              {displayPercentage}% utilized
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-hairline overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOverGoal ? 'bg-error' : 'bg-success'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-xs text-body leading-relaxed">
            {isOverGoal ? (
              <span className="text-error font-medium">
                ⚠️ You are {(latestEmissions - goalValue).toFixed(1)} kg CO₂ over your target this week. Try checking off some AI recommendations!
              </span>
            ) : (
              <span className="text-success font-medium">
                🎉 Great job! You are under your weekly carbon budget by {(goalValue - latestEmissions).toFixed(1)} kg CO₂.
              </span>
            )}
          </p>
        </div>
      ) : (
        <div className="py-2 text-center">
          <p className="text-sm text-body mb-3 leading-relaxed">
            Set a weekly carbon budget to challenge yourself and track reduction progress on your dashboard!
          </p>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex h-8 items-center justify-center rounded-full bg-ink px-4 text-xs font-medium text-white transition-colors hover:bg-ink/80"
          >
            Set Weekly Goal
          </button>
        </div>
      )}
    </div>
  );
}
