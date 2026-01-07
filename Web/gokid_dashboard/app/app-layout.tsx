'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings, LogOut, Menu, X, FolderTree, Grid3X3 } from 'lucide-react';
import { LayoutDashboard, School, Users as Supervisors, User, Package, ShoppingCart } from 'lucide-react';

const adminNavigation = [
  { name: 'Dashboard', href: '/home', icon: LayoutDashboard },
  { name: 'Classes', href: '/classes', icon: School },
  { name: 'Supervisors', href: '/supervisors', icon: Supervisors },
  { name: 'Users', href: '/users', icon: User },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
];

// Institution role has access to a limited set of pages
const institutionNavigation = [
  { name: 'Dashboard', href: '/home', icon: LayoutDashboard },
  { name: 'Categories', href: '/categories', icon: Grid3X3 },
    { name: 'SubCategories', href: '/subCategories', icon: Grid3X3 },

  // { name: 'Orders', href: '/orders', icon: ShoppingCart },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = user?.role === 'institution' ? institutionNavigation : adminNavigation;
  const allowedPaths = navigation.map((item) => item.href);

  const roleLabel = user?.role === 'admin'
    ? 'Admin'
    : user?.role === 'institution'
      ? 'Institution'
      : user?.role ?? '';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user) {
      // If current path is not allowed for this role, redirect to first allowed page
      if (!allowedPaths.includes(pathname)) {
        router.push(allowedPaths[0] ?? '/home');
      }
    }
  }, [allowedPaths, loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div className={`fixed inset-0 flex z-40 ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-opacity-75 bg-gray-900"></div>
          </div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-[#483f4d] to-[#5c5163]">
            <div className="absolute top-0 left-0 -ml-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-white">GoKid</h1>
              </div>
              <nav className="mt-5 px-2 space-y-2">
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${pathname === item.href
                          ? 'bg-[#a490af] text-white shadow-md'
                          : 'text-gray-200 hover:bg-[#7b6c83] hover:text-white'
                        }`}
                    >
                      <IconComponent 
                        className={`mr-3 h-5 w-5 ${pathname === item.href ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}
                        strokeWidth={2}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 p-4 border-t border-[#5c5163]">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-[#b9a2c5] flex items-center justify-center text-[#483f4d] font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs font-medium text-gray-300">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="ml-4 p-2 rounded-full hover:bg-[#7b6c83] text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-[#483f4d] to-[#5c5163] shadow-xl">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 mb-5">
              {/* <h1 className="text-2xl font-bold text-white">GoKid</h1> */}
              <img
                src="/SideParLogo.png"
                alt="GoKid Logo"
                className="w-50"
              />
            </div>
            <nav className="flex-1 px-3 space-y-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-colors duration-200 ${pathname === item.href
                        ? 'bg-[#a490af] text-white shadow-md'
                        : 'text-gray-200 hover:bg-[#7b6c83] hover:text-white'
                      }`}
                  >
                    <IconComponent 
                      className={`mr-3 h-5 w-5 ${pathname === item.href ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}
                      strokeWidth={2}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-[#5c5163]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#b9a2c5] flex items-center justify-center text-[#483f4d] font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-300">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  href="/settings"
                  className="p-2 rounded-full text-gray-300 hover:bg-[#7b6c83] hover:text-white transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-100">
          <button
            type="button"
            className="px-4 text-[#5c5163] hover:text-[#483f4d] md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex max-w-2xl">
              <div className="w-full flex">
                <div className="relative w-full text-gray-400 focus-within:text-[#9a87a4]">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-10 pl-10 pr-4 py-2 border border-gray-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b9a2c5] focus:border-transparent text-sm transition-all duration-200"
                    placeholder="Search..."
                    type="search"
                    name="search"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="p-2 rounded-full text-gray-500 hover:text-[#5c5163] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b9a2c5] transition-colors"
              >
                <span className="sr-only">View notifications</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <div className="h-8 w-px bg-gray-200"></div>

              <div className="flex items-center">
                <div className="text-right mr-3 hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{roleLabel}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#b9a2c5] to-[#9a87a4] flex items-center justify-center text-white font-medium shadow-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-gray-300 hover:bg-[#7b6c83] hover:text-white transition-colors mx-3"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
