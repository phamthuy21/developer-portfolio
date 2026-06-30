import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingTableProps {
  rows?: number;
  columns?: number;
}

export function LoadingTable({ rows = 5, columns = 4 }: LoadingTableProps) {
  return (
    <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <div className="flex bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 px-2">
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex p-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="flex-1 px-2">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
