import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-4">Forbidden</h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
        You do not have permission to access this page.
      </p>
      <Link 
        href={ROUTES.HOME}
        className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-md font-medium"
      >
        Return Home
      </Link>
    </div>
  );
}
