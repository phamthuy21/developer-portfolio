'use client';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/providers/auth.provider';

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6 flex items-center justify-end">
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center text-sm font-medium">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
}
