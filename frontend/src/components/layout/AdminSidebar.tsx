'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderGit2, 
  FileText, 
  Code2, 
  Briefcase, 
  Award, 
  MessageSquare,
  LogOut
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/providers/auth.provider';

const navigation = [
  { name: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { name: 'Projects', href: ROUTES.ADMIN.PROJECTS, icon: FolderGit2 },
  { name: 'Blogs', href: ROUTES.ADMIN.BLOGS, icon: FileText },
  { name: 'Skills', href: ROUTES.ADMIN.SKILLS, icon: Code2 },
  { name: 'Experience', href: ROUTES.ADMIN.EXPERIENCES, icon: Briefcase },
  { name: 'Certificates', href: ROUTES.ADMIN.CERTIFICATES, icon: Award },
  { name: 'Messages', href: ROUTES.ADMIN.MESSAGES, icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-50'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => logout()}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
