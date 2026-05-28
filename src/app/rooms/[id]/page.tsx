'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Send,
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Settings,
  MessageSquare,
  Copy,
  Check,
  LogOut,
  PlusCircle,
  Activity,
  Award,
  Zap,
  Flame,
  User,
  Coffee,
  Bookmark,
  Share2,
  Smile
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

// Tech Stack Integration
import { io } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

// 1. Zustand State Store Simulation
interface RoomState {
  messages: Message[];
  participants: Participant[];
  typingUsers: string[];
  timerTime: number; // seconds
  timerActive: boolean;
  timerMode: 'focus' | 'break';
  activityFeed: ActivityItem[];
  addMessage: (msg: Message) => void;
  setTyping: (user: string, isTyping: boolean) => void;
  updateTimer: (time: number) => void;
  setTimerActive: (active: boolean) => void;
  setTimerMode: (mode: 'focus' | 'break') => void;
  addActivity: (item: ActivityItem) => void;
}

const useRoomStore = create<RoomState>((set) => ({
  messages: [
    { id: '1', sender: 'Alex Rivera', avatar: 'AR', text: 'Welcome to the Calculus III Hub! Ready to sync our study nodes?', time: '18:30', type: 'text' },
    { id: '2', sender: 'David Kim', avatar: 'DK', text: 'David Kim joined the study sector.', time: '18:31', type: 'system-join' },
    { id: '3', sender: 'Sophia Chen', avatar: 'SC', text: 'Working on Chapter 4 integration. Need to crush this homework.', time: '18:32', type: 'text' },
  ],
  participants: [
    { name: 'Lucas Miller', avatar: 'LM', status: 'Focusing ✍️', isSpeaking: false, isMuted: false, isVideoOff: false, isOnline: true, streak: 5, isSelf: true },
    { name: 'Alex Rivera', avatar: 'AR', status: 'Focusing ✍️', isSpeaking: true, isMuted: false, isVideoOff: false, isOnline: true, streak: 12 },
    { name: 'Sophia Chen', avatar: 'SC', status: 'Reviewing 📖', isSpeaking: false, isMuted: true, isVideoOff: false, isOnline: true, streak: 8 },
    { name: 'David Kim', avatar: 'DK', status: 'Focusing ✍️', isSpeaking: false, isMuted: false, isVideoOff: true, isOnline: true, streak: 3 },
    { name: 'Elena Rostova', avatar: 'ER', status: 'Offline', isSpeaking: false, isMuted: true, isVideoOff: true, isOnline: false, streak: 7 },
  ],
  typingUsers: [],
  timerTime: 25 * 60,
  timerActive: false,
  timerMode: 'focus',
  activityFeed: [
    { id: 'act-1', text: 'Room created by Alex Rivera', time: '18:00', type: 'create' },
    { id: 'act-2', text: 'Lucas Miller joined the room', time: '18:30', type: 'join' },
  ],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setTyping: (user, isTyping) => set((state) => ({
    typingUsers: isTyping 
      ? state.typingUsers.includes(user) ? state.typingUsers : [...state.typingUsers, user]
      : state.typingUsers.filter((u) => u !== user)
  })),
  updateTimer: (time) => set({ timerTime: time }),
  setTimerActive: (active) => set({ timerActive: active }),
  setTimerMode: (mode) => set({ timerMode: mode }),
  addActivity: (item) => set((state) => ({ activityFeed: [item, ...state.activityFeed] })),
}));

// Interfaces
interface Message {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  type?: 'text' | 'system-join' | 'system-alert' | 'system-achievement';
  isSelf?: boolean;
}

interface Participant {
  name: string;
  avatar: string;
  status: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isOnline: boolean;
  streak: number;
  isSelf?: boolean;
}

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: 'join' | 'leave' | 'focus-start' | 'create' | 'achievement';
}

export default function RoomWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  // React Query Integration (Mock Fetch Room details)
  const { data: roomDetails } = useQuery({
    queryKey: ['roomDetails', roomId],
    queryFn: async () => {
      // Simulate fetch room details
      return {
        id: roomId,
        title: 'Calculus III Study Hub',
        category: 'Mathematics',
        host: 'Alex Rivera',
        maxParticipants: 12
      };
    },
    initialData: {
      id: roomId,
      title: 'Calculus III Study Hub',
      category: 'Mathematics',
      host: 'Alex Rivera',
      maxParticipants: 12
    }
  });

  // Zustand state consumption
  const store = useRoomStore();

  // Local state controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Auto scroll references
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 2. Socket.IO Setup with Fallback Client-side Simulation
  useEffect(() => {
    // Try to connect socket client (fail-safe connection)
    const socketClient = io('http://localhost:3001', { autoConnect: false });
    
    // Perform simulated websocket server pushes on mounts to give multiplayer interactive feeling
    const chatInterval = setTimeout(() => {
      // Trigger user typing event
      store.setTyping('Sophia Chen', true);
      
      const messageTimeout = setTimeout(() => {
        store.setTyping('Sophia Chen', false);
        store.addMessage({
          id: `msg-${Date.now()}`,
          sender: 'Sophia Chen',
          avatar: 'SC',
          text: 'I just solved the Stokes Theorem proof! Check out section 3.4.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        });
        store.addActivity({
          id: `act-${Date.now()}`,
          text: 'Sophia Chen unlocked STOKES MASTER achievement!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'achievement'
        });
        store.addMessage({
          id: `msg-${Date.now() + 1}`,
          sender: 'System Alert',
          avatar: 'SS',
          text: 'Sophia Chen unlocked a new achievement: STOKES MASTER! 🏆',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'system-achievement'
        });
      }, 3000);

      return () => clearTimeout(messageTimeout);
    }, 8000);

    const joinInterval = setTimeout(() => {
      store.addMessage({
        id: `msg-join-${Date.now()}`,
        sender: 'David Kim',
        avatar: 'DK',
        text: 'David Kim has established a stable connection node.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'system-join'
      });
      store.addActivity({
        id: `act-join-${Date.now()}`,
        text: 'David Kim joined the workspace',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'join'
      });
    }, 15000);

    return () => {
      socketClient.disconnect();
      clearTimeout(chatInterval);
      clearTimeout(joinInterval);
    };
  }, []);

  // Timer Tick Hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (store.timerActive && store.timerTime > 0) {
      interval = setInterval(() => {
        store.updateTimer(store.timerTime - 1);
      }, 1000);
    } else if (store.timerTime === 0) {
      store.setTimerActive(false);
      if (store.timerMode === 'focus') {
        store.setTimerMode('break');
        store.updateTimer(5 * 60);
        store.addMessage({
          id: `msg-timer-${Date.now()}`,
          sender: 'System Alert',
          avatar: 'SS',
          text: 'Focus session completed! Time for a short break. ☕',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'system-alert'
        });
      } else {
        store.setTimerMode('focus');
        store.updateTimer(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [store.timerActive, store.timerTime, store.timerMode]);

  // Scroll Chat locally without window scrollIntoView jumping
  useEffect(() => {
    if (chatEndRef.current) {
      const container = chatEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [store.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'Lucas Miller',
      avatar: 'LM',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      type: 'text'
    };

    store.addMessage(newMsg);
    setMessageText('');
  };

  const handleStartSession = () => {
    store.setTimerActive(true);
    store.addActivity({
      id: `act-focus-${Date.now()}`,
      text: 'Focus session started by Lucas Miller',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'focus-start'
    });
    store.addMessage({
      id: `msg-focus-${Date.now()}`,
      sender: 'System Alert',
      avatar: 'SS',
      text: 'Focus timer sync initialized. Deep work session active. 🧠',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system-alert'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG progress dial metrics
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = store.timerTime / (store.timerMode === 'focus' ? 25 * 60 : 5 * 60);
  const strokeDashoffset = circumference - progress * circumference;

  // Invite clipboard helper
  const handleCopyLink = () => {
    const link = `${window.location.origin}/rooms/join/${roomId}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto relative pb-10">
      
      {/* 3D ambient glows */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-studysphere-purple/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-neon-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-studysphere-blue/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-neon-pulse" style={{ animationDelay: '3s' }} />

      {/* 1. Header Navigation & Control Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/rooms" className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-500 hover:text-slate-350 transition-colors">
            <ArrowLeft size={15} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-500/20 text-blue-400 font-bold tracking-wide font-display">
                {roomDetails.category}
              </span>
              <h1 className="text-base md:text-lg font-extrabold text-white font-display">
                {roomDetails.title}
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wide">
              ROOM NODE ID: {roomId} • HOST: {roomDetails.host}
            </p>
          </div>
        </div>

        {/* Media & Space Actions Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mute Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              isMuted
                ? 'bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
          
          {/* Hide Video */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              isVideoOff
                ? 'bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {isVideoOff ? <VideoOff size={15} /> : <Video size={15} />}
          </button>

          {/* Deafened */}
          <button
            onClick={() => setIsDeafened(!isDeafened)}
            className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              isDeafened
                ? 'bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {isDeafened ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Share/Invite button */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="p-2.5 rounded-xl border border-studysphere-purple/30 bg-purple-950/20 text-studysphere-purple hover:bg-purple-950/40 cursor-pointer transition-all flex items-center gap-1.5 text-[10px] font-bold font-display uppercase tracking-wider"
          >
            <Share2 size={13} />
            Invite
          </button>

          {/* Start focus sync button */}
          {!store.timerActive && (
            <GlowingButton
              onClick={handleStartSession}
              variant="primary"
              className="!px-4 !py-2.5 !text-[10px] font-bold"
            >
              Start Sprint
            </GlowingButton>
          )}

          {/* Leave room */}
          <Link href="/rooms">
            <button className="p-2.5 rounded-xl border border-red-500/20 bg-red-950/10 hover:bg-red-950/20 text-red-400 hover:text-red-300 cursor-pointer transition-all flex items-center gap-1.5 text-[10px] font-bold font-display uppercase tracking-wider">
              <LogOut size={13} />
              Leave
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Three-Panel Dashboard Layout: Chat (Left) | Timer & Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel 1: Chat Area & Participant Grid (col-span-8) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Audio Speaking indicators / Camera previews grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {store.participants.filter(p => p.isOnline).map((p) => (
              <Card
                key={p.name}
                glowColor={p.isSpeaking ? 'purple' : 'blue'}
                className={`relative aspect-[16/10] overflow-hidden flex flex-col justify-between !p-3 transition-all duration-300 ${
                  p.isSpeaking ? 'border-studysphere-purple/40 ring-1 ring-studysphere-purple/20' : 'border-white/5'
                }`}
              >
                <div className="flex items-center justify-between z-10">
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#030014]/65 border border-white/5 text-slate-400 font-mono">
                    {p.status}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {p.isMuted && (
                      <span className="p-0.5 rounded bg-red-950/40 border border-red-500/20 text-red-400">
                        <MicOff size={9} />
                      </span>
                    )}
                    {p.isSpeaking && (
                      <span className="w-1.5 h-1.5 rounded-full bg-studysphere-purple animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Avatar frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {p.isVideoOff || (p.isSelf && isVideoOff) ? (
                    <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-slate-400 shadow-md">
                      {p.avatar}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-[#0a0520] to-slate-950/80 opacity-90 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-350 shadow-md">
                        {p.avatar}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between z-10 pt-16">
                  <span className="text-[9px] font-bold text-white font-display flex items-center gap-1">
                    {p.name.split(' ')[0]}
                    {p.isSelf && <span className="text-[7px] px-0.5 bg-studysphere-purple rounded text-white font-mono">YOU</span>}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[8px] font-mono text-purple-300">
                    <Flame size={9} className="text-studysphere-purple fill-studysphere-purple" />
                    {p.streak}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Chat area container */}
          <Card glowColor="blue" className="h-[400px] flex flex-col justify-between !p-4 border-white/5">
            {/* Header info */}
            <div className="flex items-center gap-2 pb-3.5 border-b border-white/5">
              <MessageSquare size={13} className="text-studysphere-blue" />
              <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display">
                Lobby chat log
              </h3>
            </div>

            {/* Scroll messages */}
            <div className="flex-grow overflow-y-auto py-3 space-y-3.5 scrollbar-none flex flex-col">
              {store.messages.map((msg) => {
                if (msg.type === 'system-join') {
                  return (
                    <div key={msg.id} className="flex items-center gap-2.5 text-[9px] text-slate-500 font-mono bg-white/[0.01] border border-white/5 py-1.5 px-3.5 rounded-xl w-fit mx-auto">
                      <Users size={11} className="text-slate-600 animate-pulse" />
                      <span>{msg.text}</span>
                    </div>
                  );
                }
                
                if (msg.type === 'system-alert') {
                  return (
                    <div key={msg.id} className="flex items-center gap-2.5 text-[9px] text-studysphere-purple font-mono bg-purple-950/10 border border-studysphere-purple/10 py-1.5 px-3.5 rounded-xl w-fit mx-auto animate-pulse">
                      <Clock size={11} className="text-studysphere-purple" />
                      <span>{msg.text}</span>
                    </div>
                  );
                }

                if (msg.type === 'system-achievement') {
                  return (
                    <div key={msg.id} className="flex items-center gap-2.5 text-[9px] text-studysphere-fuchsia font-mono bg-fuchsia-950/10 border border-studysphere-fuchsia/10 py-1.5 px-3.5 rounded-xl w-fit mx-auto animate-pulse">
                      <Award size={11} className="text-studysphere-fuchsia" />
                      <span>{msg.text}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 max-w-[85%] ${
                      msg.isSelf ? 'ml-auto flex-row-reverse text-right' : 'text-left'
                    }`}
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[8px] text-slate-350 flex-shrink-0 shadow-inner">
                      {msg.avatar}
                    </div>
                    <div>
                      <div className={`flex items-center gap-1.5 ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[9px] font-bold text-slate-300">{msg.sender}</span>
                        <span className="text-[7.5px] text-slate-600 font-mono">{msg.time}</span>
                      </div>
                      <p className={`text-[10.5px] mt-1 p-2.5 rounded-xl border font-sans leading-relaxed ${
                        msg.isSelf
                          ? 'bg-blue-950/20 border-studysphere-blue/20 text-slate-100 rounded-tr-none shadow-[0_0_15px_rgba(59,130,246,0.05)]'
                          : 'bg-white/[0.005] border-white/5 text-slate-350 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicators */}
              {store.typingUsers.map((user) => (
                <div key={user} className="flex gap-2.5 items-center max-w-[85%] text-left">
                  <div className="w-6.5 h-6.5 rounded-lg bg-slate-850 border border-slate-750 flex items-center justify-center font-bold text-[8px] text-slate-400 flex-shrink-0">
                    ...
                  </div>
                  <span className="text-[9px] text-slate-500 font-sans italic animate-pulse">
                    {user} is formulating proof nodes...
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Actions Bar */}
            <form onSubmit={handleSendMessage} className="border-t border-white/5 pt-3.5 flex gap-2">
              <button
                type="button"
                className="p-2 rounded-xl bg-white/[0.01] border border-white/5 text-slate-500 hover:text-slate-350 transition-colors cursor-pointer"
                title="Insert symbol"
              >
                <Smile size={13} />
              </button>
              <input
                type="text"
                placeholder="Synchronize a message node..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-grow px-3.5 py-2.5 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-studysphere-blue/50 text-xs transition-all font-sans"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-studysphere-blue hover:bg-studysphere-blue/80 text-white cursor-pointer transition-colors shadow-[0_0_10px_rgba(59,130,246,0.2)]"
              >
                <Send size={13} />
              </button>
            </form>
          </Card>
        </div>

        {/* Panel 2: Timer, Members, Activity Feed (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Circular Countdown widget */}
          <Card glowColor="purple" className="flex flex-col items-center justify-center p-6 border-white/5 relative">
            
            {/* Header tag */}
            <span className="text-[8.5px] px-2 py-0.5 rounded-md bg-purple-950 border border-purple-500/20 text-purple-300 font-mono font-bold tracking-widest uppercase mb-4">
              {store.timerMode === 'focus' ? 'Study Sprint Active' : 'Break node active'}
            </span>

            {/* Visual circle dial progress */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-900"
                  strokeWidth="5"
                  fill="transparent"
                />
                <motion.circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-studysphere-purple"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transition={{ strokeDashoffset: { duration: 0.3 } }}
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.4))'
                  }}
                />
              </svg>

              <div className="absolute text-center flex flex-col items-center">
                <span className="text-2xl font-extrabold text-white font-mono tracking-wider">
                  {formatTime(store.timerTime)}
                </span>
                <span className="text-[8px] text-slate-500 font-mono tracking-widest mt-0.5 uppercase">
                  {store.timerActive ? 'FLOWING' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Timer Actions */}
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => store.setTimerActive(!store.timerActive)}
                className="p-2 rounded-lg bg-studysphere-purple hover:bg-studysphere-purple/80 text-white cursor-pointer transition-all flex items-center justify-center"
              >
                {store.timerActive ? <Pause size={12} /> : <Play size={12} className="fill-white" />}
              </button>
              <button
                onClick={() => {
                  store.setTimerActive(false);
                  store.updateTimer(store.timerMode === 'focus' ? 25 * 60 : 5 * 60);
                }}
                className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-slate-450 hover:text-white cursor-pointer"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* Productivity statistics */}
            <div className="flex justify-between w-full mt-6 pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500 uppercase font-semibold">
              <span>Sprint Efficiency</span>
              <span className="text-emerald-400 font-bold">94% score</span>
            </div>
          </Card>

          {/* Members Panel */}
          <Card glowColor="blue" className="!p-5 border-white/5">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display mb-4 flex items-center gap-1.5">
              <Users size={13} className="text-studysphere-blue" />
              Active Node Members
            </h3>

            <div className="space-y-3.5">
              {/* Online segment */}
              <div className="space-y-2">
                <span className="text-[8px] text-slate-550 font-mono font-bold uppercase tracking-wider block">Online ({store.participants.filter(p=>p.isOnline).length})</span>
                {store.participants.filter(p => p.isOnline).map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-6.5 h-6.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[9px] text-slate-350">
                          {member.avatar}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 border border-[#030014]" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-white font-display flex items-center gap-1">
                          {member.name}
                          {member.isSelf && <span className="text-[6.5px] px-1 bg-studysphere-purple rounded text-white font-mono">YOU</span>}
                        </h4>
                        <span className="text-[8px] text-slate-500 font-sans block">{member.status}</span>
                      </div>
                    </div>

                    <span className="text-[8px] font-mono text-slate-500 font-bold flex items-center gap-0.5">
                      <Flame size={10} className="text-studysphere-blue" />
                      {member.streak}d
                    </span>
                  </div>
                ))}
              </div>

              {/* Offline segment */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[8px] text-slate-550 font-mono font-bold uppercase tracking-wider block">Offline ({store.participants.filter(p=>!p.isOnline).length})</span>
                {store.participants.filter(p => !p.isOnline).map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-2.5 opacity-40 p-2"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[9px] text-slate-500">
                      {member.avatar}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-450 font-display">{member.name}</h4>
                      <span className="text-[7.5px] text-slate-600 font-mono block">Offline</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Activity feed timeline */}
          <Card glowColor="purple" className="!p-5 border-white/5">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-wider font-display mb-4 flex items-center gap-1.5">
              <Activity size={13} className="text-studysphere-purple" />
              Lobby timeline
            </h3>

            <div className="relative border-l border-white/5 ml-2 pl-4 space-y-4 text-[9px]">
              {store.activityFeed.map((act) => {
                const getDotColor = (type: string) => {
                  if (type === 'join') return 'bg-studysphere-blue border-studysphere-blue';
                  if (type === 'achievement') return 'bg-studysphere-fuchsia border-studysphere-fuchsia';
                  if (type === 'focus-start') return 'bg-studysphere-purple border-studysphere-purple';
                  return 'bg-slate-650 border-slate-650';
                };

                return (
                  <div key={act.id} className="relative">
                    <span className={`absolute -left-5 top-1 w-2 h-2 rounded-full border-2 ${getDotColor(act.type)}`} />
                    <span className="text-slate-350 font-sans block leading-tight">{act.text}</span>
                    <span className="text-[8px] text-slate-550 font-mono block mt-0.5">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>

      {/* 3. Invite Generator Modal Backdrop */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card glowColor="purple" className="!p-8 border-white/10 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all cursor-pointer text-xs font-mono"
                >
                  ESC
                </button>

                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display mb-2 flex items-center gap-1.5">
                  <PlusCircle size={16} className="text-studysphere-purple" />
                  Generate invite link
                </h3>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed mb-6">
                  Provide classmates with credentials to secure stable study node synchronization.
                </p>

                {/* Invite Link input field */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[8.5px] text-slate-550 font-mono font-bold uppercase tracking-wider block">Invite Link</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/rooms/join/${roomId}`}
                        className="flex-grow px-3.5 py-2.5 rounded-xl bg-[#030014] border border-white/5 text-[9.5px] text-studysphere-purple font-mono focus:outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="p-2.5 rounded-xl bg-studysphere-purple hover:bg-studysphere-purple/80 text-white cursor-pointer transition-colors flex items-center justify-center w-10.5 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                      >
                        {isCopied ? <Check size={14} className="text-white animate-pulse" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8.5px] text-slate-550 font-mono font-bold uppercase tracking-wider block">Classroom Share Code</span>
                    <div className="px-4 py-3 rounded-xl bg-[#030014] border border-white/5 text-center font-mono font-extrabold text-sm text-slate-200 tracking-widest shadow-inner">
                      CALC-III-{roomId.toUpperCase()}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
