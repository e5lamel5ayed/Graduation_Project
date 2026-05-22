/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/src/types/auth';
import { authService } from '@/src/services/authService';
import { toast } from 'sonner';

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string, loginAs?: 'PlatformAdmin' | 'InstitutionAdmin' | 'Supervisor') => Promise<boolean>;
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

  const login = async (email: string, password: string, loginAs: 'PlatformAdmin' | 'InstitutionAdmin' | 'Supervisor' = 'PlatformAdmin'): Promise<boolean> => {
    try {
      // API login for both PlatformAdmin and InstitutionAdmin
      const response = await authService.login({
        identifier: email,
        password: password,
        loginAs: loginAs,
      });

      console.log('Login response:', response); // للتأكد من الـ response

      // Check if login was successful
      if (!response.succeeded) {
        toast.error(response.message || 'Login failed');
        return false;
      }

      if (!response.data) {
        toast.error('Invalid response from server');
        return false;
      }

      const { data } = response;

      const apiUser: AuthUser = {
        id: data.userId || '',
        name: data.displayName || data.email || '',
        email: data.email || email,
        role: loginAs === 'InstitutionAdmin' ? 'institution' : (loginAs === 'Supervisor' ? 'supervisor' : (data.userType || 'platform')),
        token: data.accessToken,
      };

      // Store tokens
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      localStorage.setItem('user', JSON.stringify(apiUser));
      setUser(apiUser);
      toast.success('Login successful');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Array.isArray(error.response.data.errors) 
          ? error.response.data.errors.join(', ')
          : error.response.data.errors;
        toast.error(errorMessages);
      } else {
        toast.error('Login failed. Please try again.');
      }
      
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
    localStorage.removeItem('refreshToken');
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
