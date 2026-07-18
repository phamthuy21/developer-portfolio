import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/lib/react-query/query-provider';
import { AuthProvider } from '@/providers/auth.provider';
import { PermissionProvider } from '@/providers/permission.provider';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | IT Developer Portfolio',
    default: 'IT Developer Portfolio',
  },
  description: 'A premium, modern, and high-performance digital presence showcasing projects, experience, and technical thoughts.',
  openGraph: {
    title: 'IT Developer Portfolio',
    description: 'A premium, modern, and high-performance digital presence showcasing projects, experience, and technical thoughts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT Developer Portfolio',
    description: 'A premium, modern, and high-performance digital presence showcasing projects, experience, and technical thoughts.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            <AuthProvider>
              <PermissionProvider>
                {children}
                <Toaster richColors position="top-right" />
              </PermissionProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
