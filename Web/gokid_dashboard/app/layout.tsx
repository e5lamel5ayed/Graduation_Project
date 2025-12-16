'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppLayout from './app-layout';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const inter = Inter({ subsets: ['latin'] });

// List of routes that should not use the app layout
const noLayoutRoutes = ['/login'];

// List of all valid routes that should use the app layout
const validAppRoutes = ['/home', '/users', '/classes', '/supervisors', '/categories'];

// Function to get page title based on route
const getPageTitle = (pathname: string | null): string => {
  if (!pathname) return 'Dashboard';

  const routeTitles: { [key: string]: string } = {
    '/': 'Dashboard',
    '/home': 'Home',
    '/classes': 'Classes',
    '/users': 'Users',
    '/login': 'Login',
    '/supervisors': 'Supervisors',
    '/categories': 'Categories',
  };

  return routeTitles[pathname] || 'Page Not Found';
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = noLayoutRoutes.includes(pathname || '');
  const isValidRoute = validAppRoutes.some(route => pathname?.startsWith(route));
  const isNotFound = !isPublicRoute && !isValidRoute && pathname !== '/';
  const pageTitle = getPageTitle(pathname);
  const [queryClient] = useState(() => new QueryClient());
  // Set document title
  useEffect(() => {
    document.title = `${pageTitle} | Dashboard`;
  }, [pageTitle]);

  return (
    <html lang="en" dir="ltr">
      <head>
        <title>{`${pageTitle} | Dashboard`}</title>
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>

          <AuthProvider>
            {isPublicRoute || isNotFound ? (
              <>{children}</>
            ) : (
              <AppLayout>{children}</AppLayout>
            )}
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
