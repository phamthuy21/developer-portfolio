import { cn } from '@/lib/utils';
import React from 'react';

interface TechnologyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  variant?: 'default' | 'outline' | 'secondary';
}

export function TechnologyBadge({ 
  name, 
  variant = 'secondary',
  className,
  ...props 
}: TechnologyBadgeProps) {
  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors',
        {
          'bg-primary text-primary-foreground hover:bg-primary/80': variant === 'default',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {name}
    </span>
  );
}
