'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isAuthenticated } = useAuth();

  // Show a full-screen loading spinner while validating user session
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#030014] flex flex-col items-center justify-center select-none">
        <Loader2 className="animate-spin text-studysphere-purple" size={32} />
        <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase mt-4">
          AUTHORIZING NODE...
        </span>
      </div>
    );
  }

  // Prevent flash of protected UI if unauthenticated (AuthProvider redirects automatically)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex bg-[#030014] overflow-hidden text-slate-100 relative">
      
      {/* 3D blur ambient mesh highlights */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-studysphere-purple/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-neon-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-studysphere-blue/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-neon-pulse" style={{ animationDelay: '3s' }} />

      {/* Shared Collapsible Sidebar */}
      <Sidebar />

      {/* Scrollable Main Content Pane */}
      <div className="flex-grow flex flex-col min-h-screen relative overflow-y-auto">
        <Navbar />

        {/* Inner page layouts (padding top adjusted for mobile drawer toolbar) */}
        <main className="flex-grow p-6 pt-22 md:pt-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
