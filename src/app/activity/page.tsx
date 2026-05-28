'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Video,
  Coffee,
  Award,
  Sparkles,
  Zap,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Search,
  Filter,
  Users,
  MessageSquare,
  PlusCircle,
  HelpCircle,
  ChevronRight,
  X,
  Sliders,
  Tv,
  Globe,
  UserCheck
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

// Tech Stack Integration
import { io } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

// 1. Interfaces
interface ActivityLogItem {
  id: string;
  type: 'join-room' | 'create-room' | 'start-session' | 'end-session' | 'send-message' | 'achievement' | 'pomodoro' | 'room-update';
  userName: string;
  userAvatar: string;
  title: string;
  description: string;
  roomName: string;
  roomId: string;
  sessionName?: string;
  sessionId?: string;
  timestamp: string;
  dateKey: 'today' | 'week' | 'month';
  xpReward?: string;
}

interface ActivityState {
  activities: ActivityLogItem[];
  searchQuery: string;
  selectedType: string;
  selectedDate: 'all' | 'today' | 'week' | 'month';
  selectedActivity: ActivityLogItem | null;
  showModal: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedDate: (date: 'all' | 'today' | 'week' | 'month') => void;
  setSelectedActivity: (act: ActivityLogItem | null) => void;
  setShowModal: (show: boolean) => void;
  addActivity: (act: ActivityLogItem) => void;
}

// 2. Zustand Store
const useActivityStore = create<ActivityState>((set) => ({
  activities: [
    {
      id: '1',
      type: 'pomodoro',
      userName: 'Lucas Miller',
      userAvatar: 'LM',
      title: 'Completed Pomodoro Sprint',
      description: 'Finished a 25-minute focus session on systems proof algorithms.',
      roomName: 'Rust Systems Programming',
      roomId: '2',
      sessionName: 'Rust Lifetimes Sprint',
      sessionId: 'sprint-1',
      timestamp: 'Today, 2:15 PM',
      dateKey: 'today',
      xpReward: '+120 XP'
    },
    {
      id: '2',
      type: 'join-room',
      userName: 'Sophia Chen',
      userAvatar: 'SC',
      title: 'Joined Calculus Hub',
      description: 'Connected node to coordinate vector analysis integrations.',
      roomName: 'Calculus III Study Hub',
      roomId: '1',
      timestamp: 'Today, 11:00 AM',
      dateKey: 'today',
      xpReward: '+50 XP'
    },
    {
      id: '3',
      type: 'achievement',
      userName: 'Alex Rivera',
      userAvatar: 'AR',
      title: 'Unlocked Badge: "Deep Work"',
      description: 'Logged 4+ consecutive Pomodoro cycles in a collaborative room.',
      roomName: 'Calculus III Study Hub',
      roomId: '1',
      timestamp: 'Yesterday, 8:45 PM',
      dateKey: 'week',
      xpReward: '+500 XP'
    },
    {
      id: '4',
      type: 'create-room',
      userName: 'Sophia Chen',
      userAvatar: 'SC',
      title: 'Launched Room Node',
      description: 'Launched a public space for Rust compilers architecture.',
      roomName: 'Rust Systems Programming',
      roomId: '2',
      timestamp: 'Yesterday, 3:00 PM',
      dateKey: 'week',
      xpReward: '+200 XP'
    },
    {
      id: '5',
      type: 'send-message',
      userName: 'David Kim',
      userAvatar: 'DK',
      title: 'Sent Math proof slides',
      description: 'Shared slides explaining Stokes theorem coordinates mapping.',
      roomName: 'Calculus III Study Hub',
      roomId: '1',
      timestamp: 'May 26, 4:10 PM',
      dateKey: 'week',
      xpReward: '+15 XP'
    },
    {
      id: '6',
      type: 'room-update',
      userName: 'Alex Rivera',
      userAvatar: 'AR',
      title: 'Updated Space limits',
      description: 'Expanded capacity seats from 8 to 12 slots for final prep.',
      roomName: 'Calculus III Study Hub',
      roomId: '1',
      timestamp: 'May 20, 1:30 PM',
      dateKey: 'month',
      xpReward: '+30 XP'
    }
  ],
  searchQuery: '',
  selectedType: 'all',
  selectedDate: 'all',
  selectedActivity: null,
  showModal: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedActivity: (act) => set({ selectedActivity: act }),
  setShowModal: (show) => set({ showModal: show }),
  addActivity: (act) => set((state) => ({ activities: [act, ...state.activities] }))
}));

export default function ActivityHistoryPage() {
  const router = useRouter();
  const store = useActivityStore();

  // React Query Integration (Mock stats query)
  const { data: analytics } = useQuery({
    queryKey: ['activityAnalytics'],
    queryFn: async () => {
      return {
        totalActivitiesToday: 18,
        activeClassmates: 4,
        sessionsDone: 28,
        mostActiveRoom: 'Calculus III Study Hub',
        mostActiveRoomId: '1',
        mostActiveUser: 'Sophia Chen',
        messagesSentToday: 42
      };
    },
    initialData: {
      totalActivitiesToday: 18,
      activeClassmates: 4,
      sessionsDone: 28,
      mostActiveRoom: 'Calculus III Study Hub',
      mostActiveRoomId: '1',
      mostActiveUser: 'Sophia Chen',
      messagesSentToday: 42
    }
  });

  // 3. Realtime Socket.IO client loop simulation
  useEffect(() => {
    const socket = io('http://localhost:3001', { autoConnect: false });

    // Mock incoming websocket server events (e.g. user actions in room lobbies)
    const streamInterval = setTimeout(() => {
      const mockActivities: ActivityLogItem[] = [
        {
          id: `act-live-${Date.now()}`,
          type: 'join-room',
          userName: 'Hardik Verma',
          userAvatar: 'HV',
          title: 'Joined Systems Programming',
          description: 'Established presence coordinates to review lifecycles.',
          roomName: 'Rust Systems Programming',
          roomId: '2',
          timestamp: 'Just now',
          dateKey: 'today',
          xpReward: '+50 XP'
        },
        {
          id: `act-live-${Date.now() + 1}`,
          type: 'start-session',
          userName: 'Gunshika Goel',
          userAvatar: 'GG',
          title: 'Initialized Focus Session',
          description: 'Started a Pomodoro sprint for compiler optimization.',
          roomName: 'Rust Systems Programming',
          roomId: '2',
          timestamp: 'Just now',
          dateKey: 'today',
          xpReward: '+100 XP'
        }
      ];

      // Add a live activity smoothly
      const randomAct = mockActivities[Math.floor(Math.random() * mockActivities.length)];
      store.addActivity(randomAct);
    }, 10000);

    return () => {
      socket.disconnect();
      clearTimeout(streamInterval);
    };
  }, []);

  // Filtered List Resolve
  const filteredActivities = store.activities.filter((act) => {
    const matchesSearch = act.userName.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
      act.title.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
      act.roomName.toLowerCase().includes(store.searchQuery.toLowerCase());

    const matchesType = store.selectedType === 'all' || act.type === store.selectedType;
    const matchesDate = store.selectedDate === 'all' || act.dateKey === store.selectedDate;

    return matchesSearch && matchesType && matchesDate;
  });

  // Resolve Icon style map
  const getIcon = (type: string) => {
    switch (type) {
      case 'join-room':
        return <Users size={14} className="text-studysphere-blue" />;
      case 'create-room':
        return <PlusCircle size={14} className="text-studysphere-purple" />;
      case 'start-session':
        return <Brain size={14} className="text-studysphere-purple" />;
      case 'achievement':
        return <Award size={14} className="text-studysphere-fuchsia" />;
      case 'send-message':
        return <MessageSquare size={14} className="text-studysphere-blue" />;
      case 'room-update':
        return <Sliders size={14} className="text-slate-400" />;
      default: // pomodoro
        return <Clock size={14} className="text-studysphere-fuchsia" />;
    }
  };

  const getGlowStyle = (type: string) => {
    switch (type) {
      case 'join-room':
      case 'send-message':
        return 'shadow-[0_0_15px_rgba(59,130,246,0.3)] border-studysphere-blue bg-blue-950/20 text-studysphere-blue';
      case 'achievement':
      case 'pomodoro':
        return 'shadow-[0_0_15px_rgba(217,70,239,0.3)] border-studysphere-fuchsia bg-fuchsia-950/20 text-studysphere-fuchsia';
      default:
        return 'shadow-[0_0_15px_rgba(139,92,246,0.3)] border-studysphere-purple bg-purple-950/20 text-studysphere-purple';
    }
  };

  const formatTypeLabel = (type: string) => {
    return type.replace('-', ' ').toUpperCase();
  };

  return (
    <div className="space-y-8 select-none relative pb-12">
      
      {/* Immersive mesh backgrounds */}
      <div className="absolute top-[5%] right-[25%] w-[400px] h-[400px] bg-studysphere-purple/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-neon-pulse" />
      <div className="absolute bottom-[5%] left-[20%] w-[350px] h-[350px] bg-studysphere-blue/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-neon-pulse" style={{ animationDelay: '3s' }} />

      {/* 1. Top Hero Header & Analytics Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
            Activity History
            <span className="w-1.5 h-1.5 rounded-full bg-studysphere-fuchsia animate-pulse" />
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 font-sans">
            Track study progress. Monitor deep flow cycles, message triggers, and classroom sync logs.
          </p>
        </div>

        {/* Dynamic counters grid */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-purple-950/25 border border-studysphere-purple/20 text-center min-w-[90px]">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block font-display">Today Activities</span>
            <span className="text-sm font-bold text-purple-300 font-mono">{analytics.totalActivitiesToday} logs</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-blue-950/25 border border-studysphere-blue/20 text-center min-w-[90px]">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block font-display">Active nodes</span>
            <span className="text-sm font-bold text-blue-300 font-mono">{analytics.activeClassmates} online</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-fuchsia-950/25 border border-studysphere-fuchsia/20 text-center min-w-[90px]">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block font-display">Daily sprints</span>
            <span className="text-sm font-bold text-fuchsia-300 font-mono">{analytics.sessionsDone} done</span>
          </div>
        </div>
      </div>

      {/* 2. Three-Column Workspace Dashboard split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel A: Activity Chronology (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Timeline Feed Container */}
          <Card glowColor="purple" className="!p-6 md:!p-8 border-white/5 relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                <Clock size={14} className="text-studysphere-purple" />
                Chronology logs
              </h3>
              
              <span className="text-[9px] text-slate-500 font-mono font-bold">
                {filteredActivities.length} logs found
              </span>
            </div>

            {/* Vertical chronological line */}
            <div className="relative border-l border-white/5 ml-3 pl-7 space-y-7 pb-4">
              <AnimatePresence mode="popLayout">
                {filteredActivities.map((act, index) => (
                  <motion.div
                    key={act.id}
                    layout
                    initial={{ opacity: 0, x: -15, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    {/* Glowing timeline node dot */}
                    <div
                      className={`absolute -left-11.5 top-1.5 w-8.5 h-8.5 rounded-xl border flex items-center justify-center text-xs transition-all ${getGlowStyle(act.type)}`}
                    >
                      {getIcon(act.type)}
                    </div>

                    {/* Timeline card row */}
                    <div
                      onClick={() => {
                        store.setSelectedActivity(act);
                        store.setShowModal(true);
                      }}
                      className="p-4 rounded-xl bg-white/[0.005] hover:bg-white/[0.015] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        {/* Member avatar */}
                        <div className="w-7.5 h-7.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[9px] text-slate-350 shadow-inner flex-shrink-0 mt-0.5">
                          {act.userAvatar}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-white font-display">
                              {act.userName}
                            </span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/5 text-slate-500 font-mono tracking-wider">
                              {formatTypeLabel(act.type)}
                            </span>
                            {act.xpReward && (
                              <span className="text-[8.5px] font-mono text-emerald-400 font-bold">
                                {act.xpReward}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-xs font-bold text-slate-200 mt-1 font-display">
                            {act.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5 max-w-[480px]">
                            {act.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 justify-between md:justify-end">
                        <span className="text-[8px] font-mono text-slate-550">{act.timestamp}</span>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty timeline state */}
              {filteredActivities.length === 0 && (
                <div className="py-12 text-center flex flex-col items-center justify-center -ml-7 select-none">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-12 h-12 rounded-xl bg-purple-950/20 border border-studysphere-purple/30 flex items-center justify-center text-studysphere-purple shadow-inner mb-4"
                  >
                    <Sliders size={22} className="animate-pulse" />
                  </motion.div>
                  <h4 className="text-slate-350 font-bold font-display uppercase tracking-wide">No activities matches</h4>
                  <p className="text-slate-500 text-[10px] mt-1 max-w-[200px] mx-auto leading-relaxed">
                    No history log events found. Adjust your search or filters setup.
                  </p>
                  
                  <Link href="/rooms" className="mt-4">
                    <GlowingButton variant="primary" className="!px-4 !py-2 text-[10px] font-bold">
                      Start Study Session
                    </GlowingButton>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Panel B: Advanced Search & Interactive Filters (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Advanced Search Card */}
          <Card glowColor="blue" className="!p-5 border-white/5">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display mb-4 flex items-center gap-1.5">
              <Search size={13} className="text-studysphere-blue" />
              Advanced search
            </h3>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
              <input
                type="text"
                placeholder="Search username, room name..."
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#030014] border border-white/5 text-[10px] text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-studysphere-blue/50 transition-all font-sans"
              />
            </div>
          </Card>

          {/* Interactive Filters Panel */}
          <Card glowColor="purple" className="!p-5 border-white/5 space-y-5">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5 pb-2.5 border-b border-white/5">
              <Filter size={13} className="text-studysphere-purple" />
              Interactive Filters
            </h3>

            {/* Type selector options */}
            <div className="space-y-2">
              <span className="text-[8px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Activity Category</span>
              <select
                value={store.selectedType}
                onChange={(e) => store.setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#030014] border border-white/5 text-slate-350 focus:outline-none text-[10px] font-sans cursor-pointer appearance-none"
              >
                <option value="all">All Activities</option>
                <option value="pomodoro">🍅 Completed Pomodoro</option>
                <option value="join-room">👥 Joined Room</option>
                <option value="create-room">🌐 Created Room</option>
                <option value="start-session">🧠 Started Session</option>
                <option value="send-message">💬 Sent Message</option>
                <option value="achievement">🏆 Achievement Unlocked</option>
              </select>
            </div>

            {/* Date duration filters */}
            <div className="space-y-2">
              <span className="text-[8px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Duration Scope</span>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-bold font-display uppercase">
                {(['all', 'today', 'week', 'month'] as const).map((dateOpt) => (
                  <button
                    key={dateOpt}
                    onClick={() => store.setSelectedDate(dateOpt)}
                    className={`py-2 rounded-xl border transition-all cursor-pointer ${
                      store.selectedDate === dateOpt
                        ? 'bg-purple-950/20 border-studysphere-purple text-studysphere-purple shadow-sm'
                        : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {dateOpt === 'all' && 'All time'}
                    {dateOpt === 'today' && 'Today'}
                    {dateOpt === 'week' && 'This week'}
                    {dateOpt === 'month' && 'This month'}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Mini Analytics Widgets */}
          <Card glowColor="purple" className="!p-5 border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5 pb-2.5 border-b border-white/5">
              <TrendingUp size={13} className="text-studysphere-purple" />
              Efficiency Analytics
            </h3>

            <div className="space-y-3.5">
              {/* Item A */}
              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-slate-550 font-bold uppercase tracking-wider block font-display">Most Active Room</span>
                  <span className="text-[10.5px] text-slate-200 font-bold font-display line-clamp-1 mt-0.5">{analytics.mostActiveRoom}</span>
                </div>
                <Link href={`/rooms/${analytics.mostActiveRoomId}`}>
                  <ChevronRight size={14} className="text-slate-500 hover:text-white transition-colors cursor-pointer" />
                </Link>
              </div>

              {/* Item B */}
              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-slate-550 font-bold uppercase tracking-wider block font-display">Most Active Student</span>
                  <span className="text-[10.5px] text-slate-200 font-bold font-display mt-0.5">{analytics.mostActiveUser}</span>
                </div>
                <Link href="/profile">
                  <ChevronRight size={14} className="text-slate-500 hover:text-white transition-colors cursor-pointer" />
                </Link>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* 4. Details Modal Overlay */}
      <AnimatePresence>
        {store.showModal && store.selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => store.setShowModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card glowColor="purple" className="!p-8 border-white/10 relative">
                <button
                  onClick={() => store.setShowModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-500 hover:text-slate-350 cursor-pointer text-xs font-mono"
                >
                  ESC
                </button>

                {/* Header Profile */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
                    {store.selectedActivity.userAvatar}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-display">
                      {store.selectedActivity.userName}
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">
                      Log Event ID: {store.selectedActivity.id}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[8px] text-slate-550 font-mono font-bold uppercase tracking-wider block">Log Title</span>
                    <h4 className="text-xs font-bold text-slate-200 font-display">
                      {store.selectedActivity.title}
                    </h4>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] text-slate-550 font-mono font-bold uppercase tracking-wider block">Log Description</span>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      {store.selectedActivity.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] text-slate-550 font-mono font-bold uppercase tracking-wider block">Study Space Room</span>
                    <p className="text-[10px] text-studysphere-purple font-mono font-semibold">
                      {store.selectedActivity.roomName}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2">
                    <span>Date Scope</span>
                    <span className="text-slate-300 uppercase">{store.selectedActivity.dateKey}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>Reward Nodes</span>
                    <span className="text-emerald-400 font-bold">{store.selectedActivity.xpReward || '0 XP'}</span>
                  </div>
                </div>

                {/* Modal actions */}
                <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                  <button
                    onClick={() => {
                      store.setShowModal(false);
                      router.push(`/rooms/${store.selectedActivity?.roomId}`);
                    }}
                    className="flex-grow py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] text-[10px] font-bold text-slate-400 hover:text-slate-200 cursor-pointer text-center"
                  >
                    Go to Room
                  </button>

                  <button
                    onClick={() => {
                      store.setShowModal(false);
                      router.push('/profile');
                    }}
                    className="flex-grow py-2.5 rounded-xl bg-studysphere-purple hover:bg-studysphere-purple/80 text-white cursor-pointer transition-colors text-[10px] font-bold text-center"
                  >
                    View Profile
                  </button>
                </div>

              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
