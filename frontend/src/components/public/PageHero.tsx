import { cn } from '@/lib/utils';
import React from 'react';

interface PageHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function PageHero({ 
  title, 
  description, 
  align = 'center',
  className,
  ...props 
}: PageHeroProps) {
  return (
    <div 
      className={cn(
        'w-full py-16 md:py-24 border-b bg-muted/20',
        className
      )}
      {...props}
    >
      <div className={cn(
        'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
        align === 'center' ? 'text-center' : 'text-left'
      )}>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className={cn(
            "mt-6 max-w-2xl text-xl text-muted-foreground",
            align === 'center' && "mx-auto"
          )}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
