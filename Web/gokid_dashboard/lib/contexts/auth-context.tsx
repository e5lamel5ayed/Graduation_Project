'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/src/types/auth';
import { authService } from '@/src/services/authService';

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
  
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {

      // Static login for InstitutionAdmin
      if (email === 'institution@example.com' && password === 'password') {
        const mockUser: AuthUser = {
          id: '1',
          name: 'institution Admin',
          email: 'institution@example.com',
          role: 'institution',
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }

      // API login for PlatformAdmin
      const response = await authService.login({
        identifier: email,
        password: password,
        loginAs: 'PlatformAdmin',
      });

      const apiUser: AuthUser = {
        id: response.id || response.userId || '',
        name: response.name || response.fullName || '',
        email: email,
        role: response.userType || 'institution',
        token: response.token,
      };

      // Store token
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      localStorage.setItem('user', JSON.stringify(apiUser));
      setUser(apiUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    // Static signup for demo purposes
    // In a real app, this would make an API call to register the user
    try {
      const newUser = {
        id: Date.now().toString(), // Simple ID generation for demo
        name,
        email,
        role: 'user',
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
