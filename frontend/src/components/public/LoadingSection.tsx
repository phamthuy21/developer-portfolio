import { Loader2 } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  fullHeight?: boolean;
}

export function LoadingSection({ 
  text = 'Loading...', 
  fullHeight = false,
  className,
  ...props 
}: LoadingSectionProps) {
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center p-12 text-muted-foreground',
        fullHeight ? 'min-h-[60vh]' : 'min-h-[200px]',
        className
      )}
      {...props}
    >
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
      <p className="text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
}
