'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-md font-medium"
        >
          Try again
        </button>
        <Link 
          href={ROUTES.HOME}
          className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
