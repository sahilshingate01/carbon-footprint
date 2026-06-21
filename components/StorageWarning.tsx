'use client';

import { AlertTriangle } from 'lucide-react';
import type { StorageUsage } from '@/lib/storage';

interface StorageWarningProps {
  quota: StorageUsage | null | undefined;
}

/**
 * StorageWarning renders a warning banner if the browser storage quota
 * utilized is approaching the maximum threshold.
 */
export default function StorageWarning({ quota }: StorageWarningProps) {
  if (!quota?.isApproachingLimit) return null;

  return (
    <div 
      className="mb-6 flex items-start gap-3 rounded-lg border border-error/20 bg-error/5 p-4 text-sm text-error animate-fade-in"
      role="alert"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 text-error" />
      <div>
        <span className="font-semibold text-ink">Storage Warning:</span> You are approaching your browser&apos;s storage limit ({quota.percentage}% used). Please consider exporting your data and clearing some entries to avoid data loss.
      </div>
    </div>
  );
}
