'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Users,
  Award,
  Video,
  CheckCircle,
  XCircle,
  Sparkles,
  Trash2,
  Check
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';

interface NotificationItem {
  id: string;
  type: 'invite' | 'achievement' | 'alert';
  title: string;
  description: string;
  time: string;
  read: boolean;
  sender?: string;
  roomUrl?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'invite',
    title: 'Study Room Invitation',
    description: 'Sophia Chen invited you to join the "Rust Systems Programming" study room node.',
    time: '10 mins ago',
    read: false,
    sender: 'Sophia Chen',
    roomUrl: '/rooms/2'
  },
  {
    id: '2',
    type: 'achievement',
    title: 'New Badge Unlocked: "Deep Work"',
    description: 'You unlocked the silver tier badge for completing 4 consecutive focus intervals.',
    time: '2 hours ago',
    read: false
  },
  {
    id: '3',
    type: 'alert',
    title: 'Weekly Standings Operational',
    description: 'The Diamond League has updated. You are currently positioned at #2 in global rankings.',
    time: '1 day ago',
    read: true
  },
  {
    id: '4',
    type: 'invite',
    title: 'Study Room Invitation',
    description: 'Alex Rivera invited you to join the "Calculus III Study Hub" room.',
    time: '2 days ago',
    read: true,
    sender: 'Alex Rivera',
    roomUrl: '/rooms/1'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'invites'>('all');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDeleteOne = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'invites') return n.type === 'invite';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'invite':
        return <Users size={14} className="text-studysphere-blue" />;
      case 'achievement':
        return <Award size={14} className="text-studysphere-fuchsia" />;
      default:
        return <Bell size={14} className="text-studysphere-purple" />;
    }
  };

  return (
    <div className="space-y-8 select-none max-w-4xl mx-auto">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
            Notifications
            <span className="w-1.5 h-1.5 rounded-full bg-studysphere-fuchsia animate-pulse" />
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 font-sans">
            Review alerts, system announcements, and student invites.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] text-studysphere-fuchsia font-bold tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Check size={12} />
            Mark all as read
          </button>
        )}
      </div>

      {/* 2. Main list Card */}
      <Card glowColor="fuchsia" className="!p-5 space-y-4">
        {/* Filters bar */}
        <div className="flex gap-2 border-b border-white/5 pb-4">
          {['all', 'unread', 'invites'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-3.5 py-1.5 rounded-lg text-[9px] font-bold font-display tracking-wider uppercase border transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-fuchsia-500/10 border-studysphere-fuchsia/40 text-studysphere-fuchsia shadow-[0_0_10px_rgba(217,70,239,0.15)]'
                  : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-slate-350'
              }`}
            >
              {tab === 'all' ? 'All Alerts' : tab === 'unread' ? 'Unread' : 'Invitations'}
            </button>
          ))}
        </div>

        {/* Notifications stack */}
        <div className="space-y-3 pt-2">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((n) => {
              const borderStyles = n.read
                ? 'border-white/5 bg-white/[0.005] text-slate-400'
                : 'border-studysphere-fuchsia/20 bg-fuchsia-950/5 text-slate-200';
              
              const textGlow = n.read ? 'text-white' : 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]';

              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-xl border flex gap-4 items-start justify-between transition-all group ${borderStyles}`}
                >
                  <div className="flex gap-3.5 items-start">
                    {/* Visual type icon */}
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 shadow-inner mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs font-bold font-display ${textGlow}`}>
                          {n.title}
                        </h4>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-studysphere-fuchsia animate-pulse" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans max-w-[550px] leading-relaxed">
                        {n.description}
                      </p>
                      
                      {/* Invite responses buttons if applicable */}
                      {n.type === 'invite' && !n.read && (
                        <div className="flex gap-2 pt-2.5">
                          <GlowingButton
                            variant="primary"
                            className="!px-3 !py-1.5 !text-[9px] font-bold"
                            onClick={() => {
                              handleMarkOneRead(n.id);
                            }}
                          >
                            <CheckCircle size={10} />
                            Accept Node
                          </GlowingButton>
                          <button
                            onClick={() => handleDeleteOne(n.id)}
                            className="px-3 py-1.5 rounded-lg border border-white/5 text-[9px] font-bold text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      <span className="text-[8px] font-mono text-slate-500 block pt-1">{n.time}</span>
                    </div>
                  </div>

                  {/* Direct items deletes and reads actions */}
                  <div className="flex items-center gap-1">
                    {!n.read && (
                      <button
                        onClick={() => handleMarkOneRead(n.id)}
                        className="p-1.5 rounded-lg text-slate-650 hover:text-emerald-400 hover:bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Check size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteOne(n.id)}
                      className="p-1.5 rounded-lg text-slate-650 hover:text-red-400 hover:bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty Alert */}
          {filteredNotifications.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <Bell size={24} className="mx-auto text-slate-700 animate-pulse" />
              <h4 className="text-slate-400 font-bold mt-4 font-display">Inbox is clean</h4>
              <p className="text-slate-600 text-[10px] mt-1 max-w-[200px] mx-auto">
                No active notifications found under this filter.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
