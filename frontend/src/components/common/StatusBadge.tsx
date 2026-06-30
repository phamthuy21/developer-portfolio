import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string | boolean;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export function StatusBadge({ status, type = 'default', className }: StatusBadgeProps) {
  const getVariant = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border-transparent';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 border-transparent';
      case 'danger':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border-transparent';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-transparent';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-transparent';
    }
  };

  const displayLabel = typeof status === 'boolean' ? (status ? 'Active' : 'Inactive') : status;

  return (
    <Badge variant="outline" className={cn(getVariant(), className)}>
      {displayLabel}
    </Badge>
  );
}
