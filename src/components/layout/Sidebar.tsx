'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Video,
  Timer,
  Activity,
  Trophy,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Study Rooms', href: '/rooms', icon: <Video size={18} /> },
    { name: 'Create Room', href: '/rooms/create', icon: <Plus size={18} /> },
    { name: 'Activity', href: '/activity', icon: <Activity size={18} /> },
    { name: 'Leaderboard', href: '/leaderboard', icon: <Trophy size={18} /> },
    { name: 'Notifications', href: '/notifications', icon: <Bell size={18} /> },
    { name: 'Profile', href: '/profile', icon: <User size={18} /> },
    { name: 'Settings', href: '/settings', icon: <Settings size={18} /> },
  ];

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' },
  };

  const navContent = (isMobile = false) => (
    <div className="flex flex-col h-full justify-between p-4 select-none">
      {/* Top Section: Logo & Toggle */}
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-studysphere-purple to-studysphere-blue flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] font-display">
              S
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="font-extrabold text-sm tracking-wider text-white font-display">
                StudySphere
              </span>
            )}
          </div>
          
          {/* Collapse toggle button for desktop */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer hidden md:block"
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            let isActive = false;
            if (item.href === '/rooms/create') {
              isActive = pathname === '/rooms/create';
            } else if (item.href === '/rooms') {
              isActive = (pathname === '/rooms' || pathname.startsWith('/rooms/')) && pathname !== '/rooms/create';
            } else {
              isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
            }
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-300 relative group cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-gradient-to-r from-studysphere-purple/20 to-studysphere-blue/15 border-l-2 border-studysphere-purple rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <span className={`transition-transform duration-300 group-hover:scale-105 ${isActive ? 'text-studysphere-purple' : ''}`}>
                    {item.icon}
                  </span>

                  {/* Text */}
                  {(!isCollapsed || isMobile) && (
                    <span className="text-xs tracking-wide">{item.name}</span>
                  )}
                  
                  {/* Collapsed Tooltip */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-16 bg-slate-950 border border-white/10 text-white text-[10px] px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 group-hover:left-20 transition-all duration-300 z-50 whitespace-nowrap shadow-xl">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Profile card and logout */}
      <div className="border-t border-white/5 pt-4 mt-4 flex flex-col gap-4">
        {/* Profile Info */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
            {user?.name.split(' ').map(n=>n[0]).join('') || 'U'}
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{user?.name || 'Study Node'}</h4>
              <p className="text-[10px] text-slate-500 font-light truncate">{user?.email || 'online'}</p>
            </div>
          )}
        </div>

        {/* Logout Trigger */}
        <button
          onClick={logout}
          className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full cursor-pointer text-left font-medium"
        >
          <LogOut size={18} />
          {(!isCollapsed || isMobile) && <span className="text-xs">Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Toolbar showing Menu Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#030014]/80 border-b border-white/5 backdrop-blur-md z-40 px-6 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-studysphere-purple to-studysphere-blue flex items-center justify-center font-bold text-white shadow-md text-sm font-display">
            S
          </div>
          <span className="font-extrabold text-sm tracking-wider text-white font-display">
            StudySphere
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-slate-300 hover:text-white"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 1. Desktop Sidebar Container */}
      <motion.aside
        initial="expanded"
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
        className="hidden md:flex flex-col h-screen fixed left-0 top-0 bg-[#0a0620]/20 border-r border-white/5 backdrop-blur-xl z-30 overflow-hidden shadow-2xl"
      >
        {navContent(false)}
      </motion.aside>

      {/* Spacer to push content to the right of fixed desktop sidebar */}
      <div
        className={`hidden md:block transition-all duration-400 ${
          isCollapsed ? 'w-20' : 'w-60'
        } flex-shrink-0`}
      />

      {/* 2. Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-[240px] bg-[#09051d] border-r border-white/10 z-50 shadow-2xl"
            >
              {navContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
