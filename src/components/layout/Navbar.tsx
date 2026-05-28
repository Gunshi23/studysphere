'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Flame, Search, Sparkles, Award, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [themeMode, setThemeMode] = React.useState<'cyber' | 'obsidian'>('cyber');

  // Resolve contextual titles from path
  const getPageTitle = () => {
    const segment = pathname.split('/')[1];
    if (!segment) return 'Overview';
    
    switch (segment) {
      case 'dashboard':
        return 'Dashboard';
      case 'rooms':
        if (pathname.includes('/create')) return 'Create Study Room';
        return 'Study Rooms';
      case 'session':
        return 'Focus Session';
      case 'activity':
        return 'Activity History';
      case 'leaderboard':
        return 'Leaderboard';
      case 'profile':
        return 'My Profile';
      case 'settings':
        return 'Settings';
      case 'notifications':
        return 'Notifications';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 h-16 w-full bg-[#030014]/60 border-b border-white/5 px-6 flex items-center justify-between select-none z-45 backdrop-blur-md">
      
      {/* Left side: Contextual Title & Search Bar */}
      <div className="flex items-center gap-6">
        {/* Page Contextual Title */}
        <div className="hidden md:block">
          <h2 className="text-xs md:text-sm font-extrabold tracking-wider text-white uppercase font-display flex items-center gap-2">
            {getPageTitle()}
            <span className="w-1.5 h-1.5 rounded-full bg-studysphere-purple animate-pulse" />
          </h2>
        </div>

        {/* Search Bar Input */}
        <div className="relative hidden lg:block w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
          <input
            type="text"
            placeholder="Search study assets..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-studysphere-purple/40 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right side utility icons */}
      <div className="flex items-center gap-3.5 ml-auto md:ml-0">
        
        {/* Study Streak indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/20 border border-purple-500/20 shadow-inner">
          <Flame size={14} className="text-purple-400 fill-purple-400 animate-pulse" />
          <span className="text-[10px] md:text-xs font-bold text-purple-300 font-mono">5 Day Streak</span>
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={() => setThemeMode(themeMode === 'cyber' ? 'obsidian' : 'cyber')}
          className="p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          title="Switch theme preset"
        >
          {themeMode === 'cyber' ? (
            <Moon size={14} className="text-studysphere-purple animate-pulse" />
          ) : (
            <Sun size={14} className="text-amber-400" />
          )}
        </button>

        {/* Global Notifications bell */}
        <Link href="/notifications" className="relative p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer">
          <Bell size={14} />
          {/* Active notification indicator */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-studysphere-fuchsia animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-studysphere-fuchsia" />
        </Link>

        {/* User Node Profile Avatar */}
        <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
          <div className="w-5.5 h-5.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[9px] text-white">
            {user?.name.split(' ').map(n=>n[0]).join('') || 'U'}
          </div>
          <span className="text-[10px] font-semibold text-slate-350 hidden sm:block max-w-[80px] truncate">
            {user?.name.split(' ')[0] || 'User'}
          </span>
        </Link>
      </div>
    </header>
  );
}
