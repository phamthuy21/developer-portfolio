import { cn } from '@/lib/utils';
import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  containerClassName?: string;
  hasContainer?: boolean;
}

export function Section({ 
  children, 
  className, 
  containerClassName,
  hasContainer = true, 
  ...props 
}: SectionProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      {...props}
    >
      {hasContainer ? (
        <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', containerClassName)}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
