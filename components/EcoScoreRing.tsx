'use client';

import { useEffect, useState, useMemo, memo } from 'react';
import { ECO_SCORE_THRESHOLDS } from '@/lib/constants';
import type { EcoScore } from '@/types';

interface EcoScoreRingProps {
  /**
   * The eco score object containing score (0-100), letter grade, and descriptive label.
   */
  ecoScore: EcoScore;
  /**
   * The size of the SVG container (width and height) in pixels. Defaults to 180.
   */
  size?: number;
  /**
   * The thickness of the progress ring border in pixels. Defaults to 10.
   */
  strokeWidth?: number;
  /**
   * Whether to animate the progress ring transition on mount/update. Defaults to true.
   */
  animated?: boolean;
}

/**
 * EcoScoreRing displays a circular SVG progress ring colored dynamically
 * based on the user's carbon footprint grade (A, B, C, D, or F).
 */
const EcoScoreRing = memo(function EcoScoreRing({
  ecoScore,
  size = 180,
  strokeWidth = 10,
  animated = true,
}: EcoScoreRingProps) {
  const [progress, setProgress] = useState(animated ? 0 : ecoScore.score);

  useEffect(() => {
    if (!animated) {
      const timer = setTimeout(() => setProgress(ecoScore.score), 0);
      return () => clearTimeout(timer);
    }
    const timer1 = setTimeout(() => setProgress(0), 0);
    const timer2 = setTimeout(() => setProgress(ecoScore.score), 100);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [ecoScore.score, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const offset = useMemo(() => circumference - (progress / 100) * circumference, [circumference, progress]);

  const thresholdEntry = Object.entries(ECO_SCORE_THRESHOLDS).find(
    ([key]) => key === ecoScore.grade
  );
  const color = thresholdEntry ? thresholdEntry[1].color : '#666';

  return (
    <div className="relative inline-flex items-center justify-center" id="eco-score-ring">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={`Eco score: ${ecoScore.score} out of 100, grade ${ecoScore.grade}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="text-4xl font-semibold tracking-tight"
          style={{ color }}
        >
          {Math.round(progress)}
        </span>
        <span className="text-xs font-mono uppercase tracking-wider text-mute mt-1">
          {ecoScore.label}
        </span>
      </div>
    </div>
  );
});

export default EcoScoreRing;
