import { cn } from '@/lib/utils';
import React from 'react';

interface StatisticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

export function StatisticCard({ 
  value, 
  label, 
  icon,
  className,
  ...props 
}: StatisticCardProps) {
  return (
    <div 
      className={cn(
        'flex flex-col items-center p-6 text-center rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-primary">
          {icon}
        </div>
      )}
      <div className="text-4xl font-extrabold tracking-tight text-foreground">
        {value}
      </div>
      <p className="mt-2 text-sm font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
