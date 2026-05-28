'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
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
  MessageSquare
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isSelf?: boolean;
}

interface Participant {
  name: string;
  avatar: string;
  status: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isSelf?: boolean;
}

export default function RoomWorkspacePage() {
  const params = useParams();
  const roomId = params.id as string;
  
  // Audio / Video states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Timer states (Pomodoro)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');

  // Chat message states
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Alex Rivera', avatar: 'AR', text: 'Hey team! Let’s get some focus in today.', time: '14:30' },
    { id: '2', sender: 'Sophia Chen', avatar: 'SC', text: 'Working on Chapter 4 integration. Need to crush this homework.', time: '14:31' },
    { id: '3', sender: 'David Kim', avatar: 'DK', text: 'Just finished setting up my notes. Ready to sync.', time: '14:32' },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Participant Node Avatars
  const participants: Participant[] = [
    { name: 'Lucas Miller', avatar: 'LM', status: 'Focusing ✍️', isSpeaking: false, isMuted: isMuted, isVideoOff: isVideoOff, isSelf: true },
    { name: 'Alex Rivera', avatar: 'AR', status: 'Focusing ✍️', isSpeaking: true, isMuted: false, isVideoOff: false },
    { name: 'Sophia Chen', avatar: 'SC', status: 'Reviewing 📖', isSpeaking: false, isMuted: true, isVideoOff: false },
    { name: 'David Kim', avatar: 'DK', status: 'Focusing ✍️', isSpeaking: false, isMuted: false, isVideoOff: true },
  ];

  // Timer Ticker Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // Mode switching
      if (timerMode === 'focus') {
        setTimerMode('break');
        setTimeLeft(5 * 60);
      } else {
        setTimerMode('focus');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, timerMode]);

  // Scroll Chat locally without window scrollIntoView jumping
  useEffect(() => {
    if (chatEndRef.current) {
      const container = chatEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);

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
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageText('');
  };

  // Utility time formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(timerMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/rooms" className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-500 hover:text-slate-300">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-extrabold text-white font-display">
                Calculus III Study Hub
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              ROOM ID: {roomId || 'default-node'} • HOST: ALEX RIVERA
            </p>
          </div>
        </div>

        {/* Media Controls Toolbar */}
        <div className="flex items-center gap-2.5">
          {/* Mute Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              isMuted
                ? 'bg-red-500/10 border-red-500/40 text-red-400'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          
          {/* Hide Video */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              isVideoOff
                ? 'bg-red-500/10 border-red-500/40 text-red-400'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {isVideoOff ? <VideoOff size={16} /> : <Video size={16} />}
          </button>

          {/* Deafened */}
          <button
            onClick={() => setIsDeafened(!isDeafened)}
            className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              isDeafened
                ? 'bg-red-500/10 border-red-500/40 text-red-400'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {isDeafened ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Quick Focus Session Trigger */}
          <Link href="/session/quick">
            <GlowingButton variant="secondary" className="!px-4 !py-2.5 !text-[10px] font-bold">
              Focus Screen
            </GlowingButton>
          </Link>
        </div>
      </div>

      {/* 2. Main Live Grid Area split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Col: Workspace Camera / Grid (3 columns span) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Grid of study node frames */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {participants.map((p) => (
              <Card
                key={p.name}
                glowColor={p.isSpeaking ? 'purple' : 'blue'}
                className={`relative aspect-[16/10] overflow-hidden flex flex-col justify-between !p-4 transition-all duration-300 ${
                  p.isSpeaking ? 'border-studysphere-purple/40 ring-1 ring-studysphere-purple/30' : ''
                }`}
              >
                {/* Speaking/Audio glow status indicators */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#030014]/60 border border-white/5 text-slate-400 font-mono tracking-wider font-semibold">
                    {p.status}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {p.isMuted && (
                      <span className="p-1 rounded bg-red-950/40 border border-red-500/20 text-red-400">
                        <MicOff size={10} />
                      </span>
                    )}
                    {p.isSpeaking && (
                      <span className="w-1.5 h-1.5 rounded-full bg-studysphere-purple animate-ping" />
                    )}
                  </div>
                </div>

                {/* Avatar canvas/mesh overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {p.isVideoOff ? (
                    <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-lg text-slate-400">
                      {p.avatar}
                    </div>
                  ) : (
                    // Pseudo-video feed background glow
                    <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-[#0d072b]/30 to-slate-950/20 opacity-90 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-850 border border-slate-750 flex items-center justify-center font-bold text-slate-300 shadow-md">
                        {p.avatar}
                      </div>
                    </div>
                  )}
                </div>

                {/* User tag */}
                <div className="flex items-center justify-between z-10 pt-24">
                  <span className="text-[10px] font-bold text-white font-display flex items-center gap-1">
                    {p.name}
                    {p.isSelf && <span className="text-[8px] px-1 bg-studysphere-purple rounded text-white text-[7px] tracking-wide font-mono">YOU</span>}
                  </span>
                  {!p.isVideoOff && (
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">LIVE MESH</span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Pomodoro Timer Center Dashboard widget */}
          <Card glowColor="purple" className="flex flex-col md:flex-row items-center justify-between gap-6 !p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-center text-studysphere-purple animate-pulse">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                  Shared Focus Timer
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/20 text-purple-300 font-mono tracking-widest font-semibold uppercase">
                    {timerMode}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                  Synchronized with all study nodes inside this room.
                </p>
              </div>
            </div>

            {/* Countdown Clock and Control Interface */}
            <div className="flex items-center gap-6">
              <span className="text-3xl md:text-4xl font-extrabold text-white font-mono tracking-wider drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                {formatTime(timeLeft)}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTimer}
                  className="p-2 rounded-lg bg-studysphere-purple hover:bg-studysphere-purple/80 text-white cursor-pointer transition-colors shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                >
                  {timerActive ? <Pause size={14} /> : <Play size={14} className="fill-white" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Chat Panel (1 column span) */}
        <div className="lg:col-span-1">
          <Card glowColor="blue" className="h-[520px] flex flex-col justify-between !p-4">
            {/* Chat header */}
            <div className="flex items-center gap-2 pb-3.5 border-b border-white/5">
              <MessageSquare size={14} className="text-studysphere-blue" />
              <h3 className="text-[11px] font-bold text-white uppercase tracking-wider font-display">
                Room Chat
              </h3>
            </div>

            {/* Scrollable messages area */}
            <div className="flex-grow overflow-y-auto py-4 space-y-4 scrollbar-none flex flex-col">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.isSelf ? 'ml-auto flex-row-reverse text-right' : 'text-left'
                  }`}
                >
                  {/* Sender node profile */}
                  <div className="w-6.5 h-6.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[8px] text-slate-300 flex-shrink-0">
                    {msg.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-[8.5px] font-bold text-slate-300">{msg.sender}</span>
                      <span className="text-[7.5px] text-slate-500 font-mono">{msg.time}</span>
                    </div>
                    <p className={`text-[10px] mt-1 p-2.5 rounded-xl border font-sans leading-relaxed ${
                      msg.isSelf
                        ? 'bg-blue-950/25 border-studysphere-blue/30 text-slate-100 rounded-tr-none'
                        : 'bg-white/[0.01] border-white/5 text-slate-300 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Message input form */}
            <form onSubmit={handleSendMessage} className="border-t border-white/5 pt-3.5 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-grow px-3 py-2 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-studysphere-blue/50 text-xs transition-all font-sans"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-studysphere-blue hover:bg-studysphere-blue/80 text-white cursor-pointer transition-colors"
              >
                <Send size={13} />
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
