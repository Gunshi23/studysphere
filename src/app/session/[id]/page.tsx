'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Plus,
  Trash2,
  FileText,
  Clock,
  Compass,
  Trophy,
  Coffee,
  Brain,
  Volume2,
  VolumeX,
  Music,
  Share2,
  LogOut,
  Maximize2,
  Minimize2,
  Award,
  Flame,
  Users,
  AlertCircle,
  Activity
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

// Tech Stack Integration
import { io } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

// 1. Zustand state store for Focus Session
interface SessionState {
  timeLeft: number;
  timerActive: boolean;
  timerMode: 'focus' | 'break' | 'pomodoro';
  completedCycles: number;
  notesText: string;
  notesSaved: boolean;
  immersiveMode: 'deep' | 'chill' | 'cyber' | 'night';
  isFullscreen: boolean;
  isPlayingMusic: boolean;
  musicVolume: number;
  musicCategory: 'lofi' | 'rain' | 'coffee' | 'whitenoise' | 'piano';
  activityLogs: ActivityLog[];
  participants: SessionParticipant[];
  updateTime: (time: number) => void;
  setTimerActive: (active: boolean) => void;
  setTimerMode: (mode: 'focus' | 'break' | 'pomodoro') => void;
  incrementCycles: () => void;
  setNotesText: (text: string) => void;
  setNotesSaved: (saved: boolean) => void;
  setImmersiveMode: (mode: 'deep' | 'chill' | 'cyber' | 'night') => void;
  setFullscreen: (fullscreen: boolean) => void;
  setIsPlayingMusic: (playing: boolean) => void;
  setMusicVolume: (vol: number) => void;
  setMusicCategory: (cat: 'lofi' | 'rain' | 'coffee' | 'whitenoise' | 'piano') => void;
  addActivityLog: (log: ActivityLog) => void;
  addParticipant: (p: SessionParticipant) => void;
  removeParticipant: (name: string) => void;
}

interface ActivityLog {
  id: string;
  text: string;
  time: string;
  type: 'start' | 'join' | 'break' | 'cycle-complete' | 'end';
}

interface SessionParticipant {
  name: string;
  avatar: string;
  status: string;
  isOnline: boolean;
}

const useSessionStore = create<SessionState>((set) => ({
  timeLeft: 25 * 60,
  timerActive: false,
  timerMode: 'focus',
  completedCycles: 0,
  notesText: '',
  notesSaved: true,
  immersiveMode: 'cyber',
  isFullscreen: false,
  isPlayingMusic: false,
  musicVolume: 60,
  musicCategory: 'lofi',
  activityLogs: [
    { id: '1', text: 'Immersive focus session initialized.', time: '18:50', type: 'start' },
    { id: '2', text: 'Lucas Miller established node presence.', time: '18:50', type: 'join' },
  ],
  participants: [
    { name: 'Lucas Miller', avatar: 'LM', status: 'Focusing ✍️', isOnline: true },
    { name: 'Sophia Chen', avatar: 'SC', status: 'Focusing ✍️', isOnline: true },
    { name: 'Alex Rivera', avatar: 'AR', status: 'Zen Flow 🌀', isOnline: true },
  ],
  updateTime: (time) => set({ timeLeft: time }),
  setTimerActive: (active) => set({ timerActive: active }),
  setTimerMode: (mode) => set({ timerMode: mode }),
  incrementCycles: () => set((state) => ({ completedCycles: state.completedCycles + 1 })),
  setNotesText: (text) => set({ notesText: text, notesSaved: false }),
  setNotesSaved: (saved) => set({ notesSaved: saved }),
  setImmersiveMode: (mode) => set({ immersiveMode: mode }),
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setIsPlayingMusic: (playing) => set({ isPlayingMusic: playing }),
  setMusicVolume: (vol) => set({ musicVolume: vol }),
  setMusicCategory: (cat) => set({ musicCategory: cat }),
  addActivityLog: (log) => set((state) => ({ activityLogs: [log, ...state.activityLogs] })),
  addParticipant: (p) => set((state) => ({ participants: [...state.participants, p] })),
  removeParticipant: (name) => set((state) => ({ participants: state.participants.filter(p => p.name !== name) })),
}));

export default function FocusSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  // React Query Integration
  const { data: sessionData } = useQuery({
    queryKey: ['sessionData', sessionId],
    queryFn: async () => {
      return {
        id: sessionId,
        title: 'Deep Systems & Math Proofs',
        roomName: 'Calculus III Study Hub',
        estMinutes: 120
      };
    },
    initialData: {
      id: sessionId,
      title: 'Deep Systems & Math Proofs',
      roomName: 'Calculus III Study Hub',
      estMinutes: 120
    }
  });

  // Zustand stores
  const store = useSessionStore();

  // 2. Realtime Socket.IO Client connection with Simulated Event triggers
  useEffect(() => {
    const socket = io('http://localhost:3001', { autoConnect: false });

    // Periodic simulation of active classroom updates
    const logInterval = setTimeout(() => {
      store.addActivityLog({
        id: `log-${Date.now()}`,
        text: 'Sophia Chen completed focus cycle #1.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'cycle-complete'
      });
    }, 12000);

    const joinInterval = setTimeout(() => {
      store.addParticipant({
        name: 'David Kim',
        avatar: 'DK',
        status: 'Joined focus sector',
        isOnline: true
      });
      store.addActivityLog({
        id: `log-join-${Date.now()}`,
        text: 'David Kim synchronized with focus timer.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'join'
      });
    }, 24000);

    return () => {
      socket.disconnect();
      clearTimeout(logInterval);
      clearTimeout(joinInterval);
    };
  }, []);

  // Keyboard Shortcuts Hook (Space to Toggle, Esc to Exit Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space key toggles timer active state (ignore if user is typing in textarea)
      if (e.code === 'Space') {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
          return;
        }
        e.preventDefault();
        store.setTimerActive(!store.timerActive);
      }

      // Esc key exits fullscreen zen focus mode
      if (e.code === 'Escape') {
        if (store.isFullscreen) {
          store.setFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store.timerActive, store.isFullscreen]);

  // Notepad Autosave simulation
  useEffect(() => {
    if (store.notesSaved) return;

    const saveTimeout = setTimeout(() => {
      store.setNotesSaved(true);
    }, 1500);

    return () => clearTimeout(saveTimeout);
  }, [store.notesText, store.notesSaved]);

  // Pomodoro countdown timer tick loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (store.timerActive && store.timeLeft > 0) {
      interval = setInterval(() => {
        store.updateTime(store.timeLeft - 1);
      }, 1000);
    } else if (store.timeLeft === 0) {
      store.setTimerActive(false);
      store.incrementCycles();
      
      // Auto cycle switching
      if (store.timerMode === 'focus') {
        store.setTimerMode('break');
        store.updateTime(5 * 60);
        store.addActivityLog({
          id: `log-cycle-${Date.now()}`,
          text: 'Focus cycle completed. Entering break interval.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'break'
        });
      } else {
        store.setTimerMode('focus');
        store.updateTime(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [store.timerActive, store.timeLeft, store.timerMode]);

  // Time formatter helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Immersive Mode background style resolve
  const getModeBackground = () => {
    switch (store.immersiveMode) {
      case 'deep':
        return 'bg-gradient-to-tr from-emerald-950/20 via-[#022c22]/30 to-[#030014] border-emerald-500/10';
      case 'chill':
        return 'bg-gradient-to-tr from-cyan-950/20 via-[#083344]/30 to-[#030014] border-cyan-500/10';
      case 'night':
        return 'bg-gradient-to-tr from-slate-950 via-[#0f172a]/40 to-[#030014] border-slate-700/20';
      default: // cyber
        return 'bg-gradient-to-tr from-purple-950/25 via-[#0c0525]/30 to-[#030014] border-studysphere-purple/10';
    }
  };

  const getGlowColor = () => {
    switch (store.immersiveMode) {
      case 'deep': return 'fuchsia' as const;
      case 'chill': return 'blue' as const;
      case 'night': return 'purple' as const;
      default: return 'purple' as const;
    }
  };

  const getCircleStroke = () => {
    switch (store.immersiveMode) {
      case 'deep': return 'stroke-emerald-400';
      case 'chill': return 'stroke-cyan-400';
      case 'night': return 'stroke-slate-400';
      default: return 'stroke-studysphere-purple';
    }
  };

  const getCircleGlowStyle = () => {
    switch (store.immersiveMode) {
      case 'deep': return 'rgba(16,185,129,0.4)';
      case 'chill': return 'rgba(6,182,212,0.4)';
      case 'night': return 'rgba(100,116,139,0.3)';
      default: return 'rgba(139,92,246,0.4)';
    }
  };

  // Circle progress calculation
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = store.timeLeft / (store.timerMode === 'focus' ? 25 * 60 : 5 * 60);
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Render variables
  const activeModeLabel = store.timerMode === 'focus' ? 'Deep Work Interval' : 'Rest Break Interval';

  // Inner Fullscreen Zen Overlay UI
  const zenView = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 min-h-screen min-w-screen z-50 flex flex-col items-center justify-between p-8 text-slate-100 select-none ${
        store.immersiveMode === 'deep' ? 'bg-[#011c14]' : store.immersiveMode === 'chill' ? 'bg-[#021f2d]' : store.immersiveMode === 'night' ? 'bg-[#070b13]' : 'bg-[#040114]'
      }`}
    >
      {/* Immersive mesh lighting backgrounds */}
      <div className={`absolute top-[15%] left-[25%] w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none -z-10 animate-neon-pulse ${
        store.immersiveMode === 'deep' ? 'bg-emerald-500/5' : store.immersiveMode === 'chill' ? 'bg-cyan-500/5' : store.immersiveMode === 'night' ? 'bg-slate-500/5' : 'bg-studysphere-purple/5'
      }`} />

      {/* Floating particles background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1.5px,transparent_1.5px)] [background-size:32px_32px] pointer-events-none -z-20" />

      {/* Header toolbar */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-[9px] px-2 py-0.5 rounded bg-white/[0.02] border border-white/5 text-slate-400 font-mono tracking-widest font-semibold uppercase animate-pulse">
            ZEN_FLOW_MODE
          </span>
          <span className="text-[10px] text-slate-500 font-mono">{sessionData.title}</span>
        </div>
        
        {/* Toggle back to layout */}
        <button
          onClick={() => store.setFullscreen(false)}
          className="p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[9px] font-bold font-display uppercase tracking-widest"
        >
          <Minimize2 size={13} />
          Exit Zen
        </button>
      </div>

      {/* Center piece: Massive circular clock timer */}
      <div className="flex flex-col items-center justify-center space-y-6 z-10">
        <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-white/[0.02] border border-white/5 text-slate-400 font-mono font-bold tracking-widest uppercase animate-pulse">
          {activeModeLabel}
        </span>
        
        {/* Clock Progress Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r={radius} className="stroke-white/[0.02]" strokeWidth="6" fill="transparent" />
            <motion.circle
              cx="128"
              cy="128"
              r={radius}
              className={getCircleStroke()}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transition={{ strokeDashoffset: { duration: 0.3 } }}
              style={{ filter: `drop-shadow(0 0 10px ${getCircleGlowStyle()})` }}
            />
          </svg>
          <div className="absolute text-center flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-extrabold text-white font-mono tracking-wider">
              {formatTime(store.timeLeft)}
            </span>
            <span className="text-[9px] text-slate-500 font-mono tracking-widest mt-1 uppercase font-semibold">
              {store.timerActive ? 'DEEP FOCUS' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Dial controls buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => store.setTimerActive(!store.timerActive)}
            className="p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 text-white cursor-pointer transition-all flex items-center justify-center shadow-lg"
          >
            {store.timerActive ? <Pause size={20} /> : <Play size={20} className="fill-white" />}
          </button>
          <button
            onClick={() => {
              store.setTimerActive(false);
              store.updateTime(store.timerMode === 'focus' ? 25 * 60 : 5 * 60);
            }}
            className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Footer shortcut hints */}
      <div className="w-full text-center text-[9px] text-slate-600 font-mono tracking-wider uppercase z-10">
        [SPACE] PAUSE/RESUME • [ESC] EXIT FOCUS
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 select-none relative pb-10">
      
      {/* Conditional Fullscreen Zen Overlay */}
      <AnimatePresence>
        {store.isFullscreen && zenView}
      </AnimatePresence>

      {/* 1. Immersive Top Session Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Link href={`/rooms/${sessionId}`} className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-500 hover:text-slate-350 transition-all">
            <ArrowLeft size={15} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/40 border border-purple-500/20 text-purple-300 font-bold tracking-wide font-display">
                {sessionData.roomName}
              </span>
              <h1 className="text-base md:text-lg font-extrabold text-white font-display">
                {sessionData.title}
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-studysphere-purple animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wider">
              SESSION MODE: IMMERSIVE • DURATION: {sessionData.estMinutes} MINS
            </p>
          </div>
        </div>

        {/* Focus Mode & Controls Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Immersive settings tab */}
          <div className="flex p-0.5 rounded-xl bg-white/[0.02] border border-white/5">
            {['cyber', 'deep', 'chill', 'night'].map((mode) => (
              <button
                key={mode}
                onClick={() => store.setImmersiveMode(mode as any)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold font-display uppercase tracking-wider cursor-pointer transition-all ${
                  store.immersiveMode === mode
                    ? 'bg-purple-950/30 text-studysphere-purple border border-purple-500/10 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {mode === 'cyber' ? '⚡ Cyber' : mode === 'deep' ? '🌲 Deep' : mode === 'chill' ? '🌊 Chill' : '🌑 Night'}
              </button>
            ))}
          </div>

          {/* Fullscreen Zen trigger */}
          <button
            onClick={() => store.setFullscreen(true)}
            className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] text-slate-400 hover:text-white cursor-pointer transition-all flex items-center justify-center"
            title="Zen Fullscreen focus"
          >
            <Maximize2 size={15} />
          </button>

          {/* Back to Room */}
          <Link href={`/rooms/${sessionId}`}>
            <button className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] text-slate-450 hover:text-white cursor-pointer transition-all flex items-center gap-1.5 text-[10px] font-bold font-display uppercase tracking-widest">
              <LogOut size={13} className="rotate-180" />
              Room
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Core Immersive Layout structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Clock and Lo-fi music player (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Focus Clock Card */}
          <Card glowColor={getGlowColor()} className={`flex flex-col items-center justify-center p-8 border-white/5 transition-all duration-500 ${getModeBackground()}`}>
            
            {/* Header tag status */}
            <span className={`text-[8.5px] px-2 py-0.5 rounded-md border font-mono font-bold tracking-widest uppercase mb-6 ${
              store.timerMode === 'focus'
                ? 'bg-purple-950/20 border-studysphere-purple text-purple-300'
                : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300 animate-pulse'
            }`}>
              {activeModeLabel}
            </span>

            {/* Circular countdown progress */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r={radius} className="stroke-slate-900" strokeWidth="5.5" fill="transparent" />
                <motion.circle
                  cx="96"
                  cy="96"
                  r={radius}
                  className={getCircleStroke()}
                  strokeWidth="5.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transition={{ strokeDashoffset: { duration: 0.3 } }}
                  style={{ filter: `drop-shadow(0 0 6px ${getCircleGlowStyle()})` }}
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-extrabold text-white font-mono tracking-wider drop-shadow-md">
                  {formatTime(store.timeLeft)}
                </span>
                <span className="text-[8px] text-slate-500 font-mono tracking-widest mt-0.5 uppercase">
                  {store.timerActive ? 'IN DEEP FOCUS' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Controls buttons row */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => store.setTimerActive(!store.timerActive)}
                className="p-3.5 rounded-2xl bg-studysphere-purple hover:bg-studysphere-purple/80 text-white cursor-pointer transition-colors shadow-lg flex items-center justify-center"
              >
                {store.timerActive ? <Pause size={15} /> : <Play size={15} className="fill-white" />}
              </button>
              <button
                onClick={() => {
                  store.setTimerActive(false);
                  store.updateTime(store.timerMode === 'focus' ? 25 * 60 : 5 * 60);
                }}
                className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-450 hover:text-white cursor-pointer transition-all"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </Card>

          {/* Lo-fi Sound generator widget */}
          <Card glowColor={getGlowColor()} className="!p-5 border-white/5 relative overflow-hidden">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display mb-4 flex items-center gap-1.5">
              <Music size={13} className="text-studysphere-purple" />
              Lofi ambient player
            </h3>

            {/* Equalizer animation visualizer */}
            <div className="flex items-center justify-between bg-black/40 rounded-xl p-4.5 border border-white/5">
              <div className="flex items-center gap-3">
                {/* Audio visualizer beats animation */}
                <div className="h-6.5 flex items-end gap-0.5">
                  {[1.2, 2.5, 1.8, 2.2, 1.5, 2.0].map((delay, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: store.isPlayingMusic ? ['4px', '22px', '4px'] : '4px' }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: delay * 0.2, ease: 'easeInOut' }}
                      className="w-1 rounded-sm bg-studysphere-purple"
                    />
                  ))}
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-white font-display uppercase tracking-wider">
                    {store.musicCategory === 'lofi' ? '📚 Lofi Study Beats' : store.musicCategory === 'rain' ? '🌦️ Quiet Rain Forest' : store.musicCategory === 'coffee' ? '☕ Cozy Cafe Ambient' : store.musicCategory === 'whitenoise' ? '🔊 White Noise Node' : '🎹 Calm Piano Focus'}
                  </h4>
                  <span className="text-[8px] text-slate-500 font-mono tracking-widest block uppercase mt-0.5">
                    {store.isPlayingMusic ? 'STREAMING ACTIVE' : 'STREAM MUTED'}
                  </span>
                </div>
              </div>

              {/* Player trigger */}
              <button
                onClick={() => store.setIsPlayingMusic(!store.isPlayingMusic)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  store.isPlayingMusic
                    ? 'bg-purple-950/25 border-studysphere-purple text-studysphere-purple shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                    : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-white'
                }`}
              >
                {store.isPlayingMusic ? <Pause size={13} /> : <Play size={13} className="fill-white" />}
              </button>
            </div>

            {/* Music type options buttons list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-[9px] font-bold font-display uppercase">
              {(['lofi', 'rain', 'coffee', 'whitenoise', 'piano'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => store.setMusicCategory(cat)}
                  className={`py-2 rounded-xl border cursor-pointer transition-all ${
                    store.musicCategory === cat
                      ? 'bg-purple-950/20 border-studysphere-purple text-studysphere-purple shadow-[0_0_10px_rgba(139,92,246,0.1)]'
                      : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-slate-350'
                  }`}
                >
                  {cat === 'lofi' && '🎧 Lofi'}
                  {cat === 'rain' && '🌦️ Rain'}
                  {cat === 'coffee' && '☕ Cafe'}
                  {cat === 'whitenoise' && '🔊 Noise'}
                  {cat === 'piano' && '🎹 Piano'}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Center Column: Notes Panel & Stats (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Notebook area */}
          <Card glowColor={getGlowColor()} className="flex flex-col h-[280px] border-white/5">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                <FileText size={13} className="text-studysphere-purple" />
                Workspace notebook
              </h3>
              <span className="text-[9px] text-slate-500 font-mono font-bold flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${store.notesSaved ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                {store.notesSaved ? 'SAVED TO CLOUD' : 'SAVING CHANGES...'}
              </span>
            </div>

            {/* Note Text area input */}
            <textarea
              value={store.notesText}
              onChange={(e) => store.setNotesText(e.target.value)}
              placeholder="Dump active equations, theorem breakdowns, or markdown notes logs here..."
              className="flex-grow w-full h-full py-3 resize-none bg-transparent text-xs text-slate-350 placeholder:text-slate-650 focus:outline-none scrollbar-none font-sans leading-relaxed"
            />
          </Card>

          {/* Metrics summary and live timeline stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Left: Stats list panel */}
            <Card glowColor={getGlowColor()} className="!p-5 border-white/5 space-y-4">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5 pb-2.5 border-b border-white/5">
                <Trophy size={13} className="text-studysphere-purple" />
                Focus Metrics
              </h3>
              
              <div className="space-y-3 text-[10px] font-mono text-slate-500">
                <div className="flex justify-between">
                  <span>Productivity Score</span>
                  <span className="text-emerald-400 font-bold">96/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Focus Cycles</span>
                  <span className="text-slate-300 font-bold">{store.completedCycles} cycles</span>
                </div>
                <div className="flex justify-between">
                  <span>Study Streak</span>
                  <span className="text-purple-300 font-bold flex items-center gap-0.5">
                    <Flame size={11} className="text-studysphere-purple fill-studysphere-purple" />
                    5 days
                  </span>
                </div>
              </div>
            </Card>

            {/* Right: Active participants list & timeline logs */}
            <Card glowColor={getGlowColor()} className="!p-5 border-white/5 space-y-4">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5 pb-2.5 border-b border-white/5">
                <Users size={13} className="text-studysphere-purple" />
                Node Classmates ({store.participants.length})
              </h3>

              <div className="space-y-2.5 max-h-24 overflow-y-auto scrollbar-none">
                {store.participants.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-[9px] font-sans text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-slate-850 border border-slate-750 flex items-center justify-center font-bold text-[8px] text-slate-300">
                        {p.avatar}
                      </div>
                      <span className="font-bold text-white">{p.name}</span>
                    </div>
                    <span className="text-[8px] font-mono text-purple-350">{p.status}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Timeline events logs feed */}
          <Card glowColor={getGlowColor()} className="!p-5 border-white/5">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display mb-4 flex items-center gap-1.5 pb-2 border-b border-white/5">
              <Activity size={13} className="text-studysphere-purple" />
              Focus timeline
            </h3>

            <div className="relative border-l border-white/5 ml-2 pl-4 space-y-4 text-[9px] max-h-28 overflow-y-auto scrollbar-none">
              {store.activityLogs.map((log) => {
                const getDotStyle = (type: string) => {
                  if (type === 'join') return 'bg-studysphere-blue border-studysphere-blue';
                  if (type === 'cycle-complete') return 'bg-studysphere-fuchsia border-studysphere-fuchsia';
                  return 'bg-studysphere-purple border-studysphere-purple';
                };

                return (
                  <div key={log.id} className="relative">
                    <span className={`absolute -left-5 top-1.5 w-1.5 h-1.5 rounded-full border ${getDotStyle(log.type)}`} />
                    <span className="text-slate-350 font-sans block leading-tight">{log.text}</span>
                    <span className="text-[8px] text-slate-550 font-mono block mt-0.5">{log.time}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
