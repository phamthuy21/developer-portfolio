import { cn } from '@/lib/utils';
import React from 'react';

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
}

export function SectionTitle({ 
  title, 
  subtitle, 
  alignment = 'center',
  className,
  ...props 
}: SectionTitleProps) {
  return (
    <div 
      className={cn(
        'mb-12 flex flex-col',
        {
          'items-start text-left': alignment === 'left',
          'items-center text-center': alignment === 'center',
          'items-end text-right': alignment === 'right',
        },
        className
      )}
      {...props}
    >
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
