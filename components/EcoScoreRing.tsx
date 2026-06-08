'use client';

import { useEffect, useState } from 'react';
import { ECO_SCORE_THRESHOLDS } from '@/lib/constants';
import type { EcoScore } from '@/types';

interface EcoScoreRingProps {
  ecoScore: EcoScore;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

export default function EcoScoreRing({
  ecoScore,
  size = 180,
  strokeWidth = 10,
  animated = true,
}: EcoScoreRingProps) {
  const [progress, setProgress] = useState(animated ? 0 : ecoScore.score);

  useEffect(() => {
    if (!animated) {
      setProgress(ecoScore.score);
      return;
    }
    setProgress(0);
    const timer = setTimeout(() => setProgress(ecoScore.score), 100);
    return () => clearTimeout(timer);
  }, [ecoScore.score, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

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
}
