'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, Volume2, Send, Flame, Trophy, Users, Shield, Headphones, Star, Activity } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  role?: string;
  isSystem?: boolean;
}

export default function RoomPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Lucas Miller', avatar: 'LM', content: 'Joined the study stream! Ready to log 3 hours today 🚀', time: '14:32', role: 'Host' },
    { id: '2', sender: 'Sofia Rodriguez', avatar: 'SR', content: 'Same here, got a huge chemistry test tomorrow.', time: '14:33' },
    { id: '3', sender: 'System', avatar: 'SYS', content: 'Sofia Rodriguez started a 50-minute study sprint.', time: '14:33', isSystem: true },
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { name: 'Sofia Rodriguez', time: 140, active: true, xp: 850 },
    { name: 'Lucas Miller', time: 110, active: true, xp: 620 },
    { name: 'Alex Chen', time: 95, active: false, xp: 480 },
    { name: 'Emily Watts', time: 70, active: true, xp: 350 },
  ]);

  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(2999); // 49:59
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // Pomodoro countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 2999));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format countdown timer (MM:SS)
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulating active typing messages to make it feel alive!
  useEffect(() => {
    const chatSequence = [
      {
        user: 'Alex Chen',
        typingDelay: 2000,
        content: 'Hey guys, did you solve question 4 on page 12 of the study guide?',
        afterDelay: 1000,
      },
      {
        user: 'Lucas Miller',
        typingDelay: 3000,
        content: 'Yeah! It is a matrix transpose. Let me share my screen to show you.',
        afterDelay: 2000,
      },
      {
        user: 'System',
        typingDelay: 0,
        content: 'Lucas Miller started sharing screen (Workspace 1).',
        isSystem: true,
        afterDelay: 3000,
      },
      {
        user: 'Sofia Rodriguez',
        typingDelay: 2000,
        content: 'Awesome, that helps a ton, Lucas! Matrix multiplication was driving me crazy.',
        afterDelay: 4000,
      },
    ];

    let currentStep = 0;
    let sequenceTimeout: NodeJS.Timeout;

    const runSequenceStep = () => {
      if (currentStep >= chatSequence.length) {
        // Reset sequence after completion
        currentStep = 0;
      }
      
      const step = chatSequence[currentStep];

      // 1. Set user typing indicator
      if (!step.isSystem && step.typingDelay > 0) {
        setTypingUser(step.user);
      }

      // 2. Wait for typing time, then add message
      sequenceTimeout = setTimeout(() => {
        setTypingUser(null);
        
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Append message
        setMessages((prev) => [
          ...prev,
          {
            id: String(prev.length + 1),
            sender: step.isSystem ? 'System' : step.user,
            avatar: step.user.split(' ').map(n => n[0]).join(''),
            content: step.content,
            time: timeStr,
            isSystem: step.isSystem || false,
            role: step.user === 'Lucas Miller' ? 'Host' : undefined,
          },
        ]);

        // Mock increment leaderboard points
        if (!step.isSystem) {
          setLeaderboard((prevLeaderboard) =>
            prevLeaderboard.map((item) =>
              item.name === step.user
                ? { ...item, time: item.time + 5, xp: item.xp + 25 }
                : item
            )
          );
        }

        currentStep++;
        // Trigger next message after afterDelay
        sequenceTimeout = setTimeout(runSequenceStep, step.afterDelay);
      }, step.typingDelay);
    };

    // Start typing cycle
    sequenceTimeout = setTimeout(runSequenceStep, 5000);

    return () => clearTimeout(sequenceTimeout);
  }, []);

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto w-full z-10 select-none">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studysphere-purple/10 border border-studysphere-purple/20 mb-4"
        >
          <span className="text-[10px] tracking-widest text-studysphere-purple font-bold uppercase">LIVE INTERFACE</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-6"
        >
          Experience StudySphere In Action
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base md:text-lg"
        >
          Peek inside an active focus sprint. Connect cameras, share screen files, trigger synchronized study intervals, and watch your productivity climb.
        </motion.p>
      </div>

      {/* Main Mockup UI Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full h-auto min-h-[580px] bg-slate-950/80 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative"
      >
        {/* Glow backlight behind panel */}
        <div className="absolute top-0 left-1/3 right-1/3 h-1 bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent" />

        {/* 1. Header Toolbar */}
        <div className="bg-slate-900/40 border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Headphones size={20} />
            </span>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                Quantum Physics Study Core
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
                  PUBLIC LOBBY
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-light flex items-center gap-1.5 mt-0.5">
                <Users size={12} /> 12 Online now | Goal: 3 Pomodoro Cycles
              </p>
            </div>
          </div>
          
          {/* Mock Connection controls */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors hover:bg-cyan-400 cursor-pointer">
              <Video size={14} /> Share Camera
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-semibold text-xs hover:bg-white/[0.08] cursor-pointer">
              <Mic size={14} /> Muted
            </button>
          </div>
        </div>

        {/* 2. Main Room workspace */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT: Leaderboard & streaks */}
          <div className="col-span-1 lg:col-span-3 bg-slate-900/20 border-r border-white/5 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/5">
                <Trophy className="text-yellow-500" size={16} />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Weekly Leaderboard</span>
              </div>

              <div className="flex flex-col gap-2">
                {leaderboard.map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                        {user.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {user.name}
                          {user.active && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-light">{user.xp} XP</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-cyan-400 font-mono">{user.time}m</div>
                      <div className="text-[9px] text-slate-500 font-light">sprint logs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom streak widget */}
            <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3.5 mt-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Flame size={16} className="animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Daily Streaks</span>
              </div>
              <p className="text-[11px] text-slate-300 font-light">Lucas is on a 5-day study streak! Keep pushing.</p>
            </div>
          </div>

          {/* CENTER: Main Focus Timer Screen & Video grids */}
          <div className="col-span-1 lg:col-span-5 p-6 flex flex-col justify-between items-center bg-black/20">
            {/* Mock screens container */}
            <div className="w-full bg-slate-950/95 border border-white/10 rounded-2xl overflow-hidden aspect-video flex flex-col justify-center items-center relative shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              
              {/* Pulsing signal graphic */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-44 h-44 rounded-full border border-cyan-500/10 flex items-center justify-center"
              >
                <div className="w-32 h-32 rounded-full border border-cyan-500/20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-cyan-500/30" />
                </div>
              </motion.div>

              <span className="text-[10px] text-cyan-400 tracking-widest font-semibold uppercase mb-2 relative z-10 flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                <Activity size={10} className="animate-pulse" /> ACTIVE POMODORO SPRINT
              </span>
              
              <h4 className="text-5xl font-extrabold text-white tracking-widest font-mono relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                {formatTimer(timerSeconds)}
              </h4>
              
              <span className="text-xs text-slate-400 font-light mt-2 relative z-10">
                Syncing with 4 study partners...
              </span>
            </div>

            {/* Bottom active media info */}
            <div className="w-full flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-xl mt-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎧</span>
                <div>
                  <div className="text-xs font-bold text-white">Lofi Beats To Focus</div>
                  <div className="text-[9px] text-slate-400 font-light">ChilledCow Official Stream</div>
                </div>
              </div>
              <div className="flex gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Volume2 size={16} />
              </div>
            </div>
          </div>

          {/* RIGHT: Live Chat channel */}
          <div className="col-span-1 lg:col-span-4 bg-slate-900/20 border-l border-white/5 p-4 flex flex-col justify-between h-[450px] lg:h-auto">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/5">
              <Users className="text-purple-400" size={16} />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Room Live Chat</span>
            </div>

            {/* Chats list area */}
            <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin max-h-[300px] lg:max-h-[360px]">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-2.5 ${msg.isSystem ? 'bg-white/[0.01] border border-dashed border-white/5 p-2 rounded-xl' : ''}`}
                  >
                    {/* User profile avatar */}
                    {!msg.isSystem && (
                      <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                        {msg.avatar}
                      </div>
                    )}
                    
                    <div className="flex-grow">
                      {msg.isSystem ? (
                        <p className="text-[10px] text-slate-400 leading-normal flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-cyan-400" />
                          {msg.content}
                        </p>
                      ) : (
                        <>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                              {msg.sender}
                              {msg.role && (
                                <span className="text-[8px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1 rounded">
                                  {msg.role}
                                </span>
                              )}
                            </span>
                            <span className="text-[9px] text-slate-500">{msg.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-light mt-0.5">
                            {msg.content}
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Animated Typing Indicator */}
                {typingUser && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-2 bg-white/[0.01] rounded-xl border border-white/5"
                  >
                    <div className="text-[10px] text-slate-400 italic font-light flex items-center gap-1.5">
                      <div className="flex gap-1 items-center h-2">
                        <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      {typingUser} is typing...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatBottomRef} />
            </div>

            {/* Send chat entry box */}
            <div className="mt-4 flex gap-2">
              <input
                disabled
                type="text"
                placeholder="Simulating study room chat..."
                className="flex-grow bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-400 focus:outline-none select-none"
              />
              <button disabled className="p-2 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center border border-white/5">
                <Send size={14} />
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
