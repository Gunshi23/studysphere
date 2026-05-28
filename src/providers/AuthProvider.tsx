'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, avatarUrl: string | null) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          avatarUrl: firebaseUser.photoURL || null,
        };
        setUser(profile);
        localStorage.setItem('studysphere_user', JSON.stringify(profile));
        // Set cookie for middleware check
        document.cookie = 'studysphere_session=true; path=/; max-age=86400; SameSite=Lax';
      } else {
        setUser(null);
        localStorage.removeItem('studysphere_user');
        // Clear session cookie
        document.cookie = 'studysphere_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const profile: UserProfile = {
        name: firebaseUser.displayName || email.split('@')[0],
        email: email,
        avatarUrl: firebaseUser.photoURL || null,
      };
      
      setUser(profile);
      localStorage.setItem('studysphere_user', JSON.stringify(profile));
      document.cookie = 'studysphere_session=true; path=/; max-age=86400; SameSite=Lax';
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Firebase Login Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, avatarUrl: string | null) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile display name and avatar photo
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: avatarUrl,
      });

      const profile: UserProfile = {
        name,
        email,
        avatarUrl,
      };

      setUser(profile);
      localStorage.setItem('studysphere_user', JSON.stringify(profile));
      document.cookie = 'studysphere_session=true; path=/; max-age=86400; SameSite=Lax';
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Firebase Register Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('studysphere_user');
      document.cookie = 'studysphere_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      router.push('/login');
    } catch (error) {
      console.error('Firebase SignOut Error:', error);
    } finally {
      setLoading(false);
    }
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
