import { LoginForm } from '@/features/admin/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <LoginForm />
    </div>
  );
}
