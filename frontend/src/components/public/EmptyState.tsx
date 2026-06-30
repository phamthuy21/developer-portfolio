import { cn } from '@/lib/utils';
import { FileQuestion } from 'lucide-react';
import React from 'react';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  icon = <FileQuestion className="h-12 w-12 text-muted-foreground" />,
  className,
  ...props 
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed',
        className
      )}
      {...props}
    >
      <div className="mb-4 p-4 rounded-full bg-muted/50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
}
