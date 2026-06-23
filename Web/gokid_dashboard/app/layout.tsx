
'use client';

import { AuthProvider } from '@/lib/contexts/auth-context';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppLayout from './app-layout';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

// List of routes that should not use the app layout
const noLayoutRoutes = ['/login'];

// List of all valid routes that should use the app layout
const validAppRoutes = ['/home', '/users', '/classes', '/children', '/supervisors', '/categories', '/subCategories', '/tasks', '/adventures', '/gifts'];

// Function to get page title based on route
const getPageTitle = (pathname: string | null): string => {
  if (!pathname) return 'Dashboard';

  const routeTitles: { [key: string]: string } = {
    '/': 'Dashboard',
    '/home': 'Home',
    '/classes': 'Classes',
    '/children': 'Children',
    '/users': 'Users',
    '/login': 'Login',
    '/supervisors': 'Supervisors',
    '/categories': 'Categories',
    '/subCategories': 'SubCategories',
    '/tasks': 'Tasks',
    '/adventures': 'Adventures',
    '/adventures/builder': 'Adventure Builder',
    '/gifts': 'Gifts',
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
      <body className="font-sans antialiased" suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" richColors />
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
