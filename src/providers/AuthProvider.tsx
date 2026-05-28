'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string, avatarUrl: string | null) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load session from localStorage & cookies on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('studysphere_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    // Mock user profile details
    const mockUser: UserProfile = {
      name: 'Lucas Miller',
      email: email,
      avatarUrl: null,
    };
    setUser(mockUser);
    localStorage.setItem('studysphere_user', JSON.stringify(mockUser));
    
    // Set cookie for middleware check
    document.cookie = 'studysphere_session=true; path=/; max-age=86400; SameSite=Lax';
    
    setLoading(false);
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, avatarUrl: string | null) => {
    setLoading(true);
    const mockUser: UserProfile = {
      name,
      email,
      avatarUrl,
    };
    setUser(mockUser);
    localStorage.setItem('studysphere_user', JSON.stringify(mockUser));
    
    // Set cookie for middleware check
    document.cookie = 'studysphere_session=true; path=/; max-age=86400; SameSite=Lax';
    
    setLoading(false);
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studysphere_user');
    
    // Clear session cookie
    document.cookie = 'studysphere_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
    
    router.push('/login');
  };

  // Client-side fallback check for protected routes
  useEffect(() => {
    if (loading) return;

    const protectedPaths = [
      '/dashboard',
      '/rooms',
      '/session',
      '/activity',
      '/leaderboard',
      '/profile',
      '/settings',
      '/notifications',
    ];

    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
    const hasSession = document.cookie.includes('studysphere_session=true');

    if (isProtected && !hasSession) {
      router.push('/login');
    }

    // Redirect authenticated users away from auth pages
    if (hasSession && (pathname === '/login' || pathname === '/register')) {
      router.push('/dashboard');
    }
  }, [pathname, user, loading, router]);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
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
