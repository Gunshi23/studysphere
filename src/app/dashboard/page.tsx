'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Clock,
  Video,
  Award,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Play,
  Calendar,
  Users
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const stats = [
    { label: 'Study Time', value: '32.4 hrs', change: '+4.2h this week', icon: <Clock size={20} className="text-studysphere-purple" />, color: 'purple' as const },
    { label: 'Rooms Joined', value: '18 rooms', change: '+3 this week', icon: <Video size={20} className="text-studysphere-blue" />, color: 'blue' as const },
    { label: 'Rank Position', value: '#12', change: 'Top 5%', icon: <Award size={20} className="text-studysphere-fuchsia" />, color: 'fuchsia' as const },
  ];

  const recentRooms = [
    { id: '1', title: 'Calculus III Study Hub', host: 'Alex Rivera', members: 8, maxMembers: 12, category: 'Mathematics' },
    { id: '2', title: 'Rust Systems Programming', host: 'Sophia Chen', members: 4, maxMembers: 6, category: 'Computer Science' },
    { id: '3', title: 'Organic Chemistry Prep', host: 'David Kim', members: 11, maxMembers: 15, category: 'Chemistry' },
  ];

  const leaderboardTop = [
    { name: 'Sophia Chen', xp: '4,850 XP', level: 'Lv. 14', rank: 1, avatar: 'SC' },
    { name: 'Lucas Miller', xp: '4,210 XP', level: 'Lv. 12', rank: 2, avatar: 'LM', isSelf: true },
    { name: 'Yuki Tanaka', xp: '3,980 XP', level: 'Lv. 11', rank: 3, avatar: 'YT' },
  ];

  // Animated path calculation for the SVG activity graph
  const points = '30,120 70,80 110,95 150,45 190,60 230,30 270,15';
  
  return (
    <div className="space-y-8 select-none">
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2"
          >
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-studysphere-purple to-studysphere-blue">{user?.name.split(' ')[0] || 'Lucas'}</span>
            <motion.span
              animate={{ rotate: [0, 15, -15, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 4 }}
              className="inline-block"
            >
              👋
            </motion.span>
          </motion.h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 font-sans">
            Your study nodes are operational. Ready to continue your learning sprint?
          </p>
        </div>

        {/* Start Focus CTA */}
        <Link href="/session/quick">
          <GlowingButton variant="primary" className="!px-6 !py-2.5 text-xs font-semibold">
            <Play size={14} className="fill-white" />
            Start Quick Session
          </GlowingButton>
        </Link>
      </div>

      {/* 2. Stats Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card glowColor={stat.color} className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                  {stat.label}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 font-display">
                  {stat.value}
                </h3>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp size={10} />
                  {stat.change}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 shadow-inner">
                {stat.icon}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3. Main Dashboard Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Weekly Activity & Rooms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Weekly Activity Line Graph */}
          <Card glowColor="purple" className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <TrendingUp size={16} className="text-studysphere-purple" />
                  Weekly Study Metrics
                </h3>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">Activity measured in minutes per day</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/5">
                <Calendar size={12} />
                May 22 - May 28
              </div>
            </div>

            {/* Custom SVG line chart */}
            <div className="h-48 w-full relative flex items-end">
              <svg className="w-full h-full" viewBox="0 0 300 130" preserveAspectRatio="none">
                <defs>
                  {/* Fill Gradient */}
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                  {/* Stroke Glow Filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="65" x2="300" y2="65" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Fill Area */}
                <path
                  d={`M 30,120 L ${points} L 270,120 Z`}
                  fill="url(#chartGradient)"
                />

                {/* Stroke Line */}
                <motion.path
                  d={`M ${points}`}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2.5"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                
                {/* Horizontal line gradient for neon purple to blue transition */}
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>

                {/* Dots on nodes */}
                <circle cx="30" cy="120" r="3.5" fill="#8b5cf6" stroke="#030014" strokeWidth="1.5" />
                <circle cx="70" cy="80" r="3.5" fill="#8b5cf6" stroke="#030014" strokeWidth="1.5" />
                <circle cx="110" cy="95" r="3.5" fill="#8b5cf6" stroke="#030014" strokeWidth="1.5" />
                <circle cx="150" cy="45" r="3.5" fill="#8b5cf6" stroke="#030014" strokeWidth="1.5" />
                <circle cx="190" cy="60" r="3.5" fill="#8b5cf6" stroke="#030014" strokeWidth="1.5" />
                <circle cx="230" cy="30" r="3.5" fill="#3b82f6" stroke="#030014" strokeWidth="1.5" />
                <circle cx="270" cy="15" r="3.5" fill="#3b82f6" stroke="#030014" strokeWidth="1.5" />
              </svg>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between px-2.5 mt-2.5 text-[9px] text-slate-500 font-mono tracking-wider font-semibold">
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>TODAY</span>
            </div>
          </Card>

          {/* Active study rooms list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                <Video size={16} className="text-studysphere-blue" />
                Active Study Rooms
              </h3>
              <Link href="/rooms" className="text-[10px] text-studysphere-blue font-bold tracking-wider hover:underline flex items-center gap-1">
                Browse Rooms
                <ArrowRight size={10} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentRooms.map((room) => (
                <Card key={room.id} glowColor="blue" className="!p-5 hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-500/20 text-blue-400 font-bold tracking-wide font-display">
                        {room.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2 font-display">{room.title}</h4>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">Hosted by {room.host}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                      <Users size={12} className="text-slate-500" />
                      {room.members} / {room.maxMembers} Nodes
                    </span>
                    
                    <Link href={`/rooms/${room.id}`}>
                      <GlowingButton variant="secondary" className="!px-3.5 !py-1.5 !text-[9px] font-bold">
                        Enter Room
                      </GlowingButton>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Leaderboard Snippet & Streak */}
        <div className="space-y-8">
          
          {/* Active Streak Card */}
          <Card glowColor="fuchsia" className="flex flex-col items-center text-center p-8 relative overflow-hidden">
            {/* Background absolute flame glowing pattern */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-studysphere-fuchsia/10 rounded-full blur-3xl pointer-events-none -z-10" />
            
            <div className="w-16 h-16 rounded-full bg-fuchsia-950/20 border border-fuchsia-500/20 flex items-center justify-center shadow-inner relative animate-float">
              <Flame size={32} className="text-studysphere-fuchsia fill-studysphere-fuchsia animate-pulse" />
              {/* Flame spark particles */}
              <span className="absolute top-2 right-4 w-1 h-1 rounded-full bg-studysphere-fuchsia animate-ping" />
              <span className="absolute bottom-2 left-3 w-1.5 h-1.5 rounded-full bg-studysphere-fuchsia animate-pulse" />
            </div>

            <h3 className="text-2xl font-bold text-white mt-4 font-display">5 Day Streak</h3>
            <p className="text-slate-400 text-xs mt-1.5 max-w-[200px] leading-relaxed">
              Supercharged active node. Study for 15 more minutes to secure Day 6!
            </p>

            {/* Streak grid representation */}
            <div className="flex gap-2.5 mt-6">
              {[true, true, true, true, true, false, false].map((active, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[9px] font-mono border transition-all ${
                    active
                      ? 'bg-fuchsia-950/40 border-studysphere-fuchsia text-studysphere-fuchsia shadow-[0_0_10px_rgba(217,70,239,0.2)]'
                      : 'bg-white/[0.02] border-white/5 text-slate-600'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </Card>

          {/* Leaderboard snippet */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                <Award size={16} className="text-studysphere-fuchsia" />
                Global Standings
              </h3>
              <Link href="/leaderboard" className="text-[10px] text-studysphere-fuchsia font-bold tracking-wider hover:underline flex items-center gap-1">
                Full Rankings
                <ArrowRight size={10} />
              </Link>
            </div>

            <Card glowColor="fuchsia" className="divide-y divide-white/5 space-y-3.5">
              {leaderboardTop.map((node, i) => (
                <div
                  key={node.name}
                  className={`flex items-center justify-between pt-3.5 first:pt-0 ${
                    node.isSelf ? 'bg-white/[0.02] -mx-4 px-4 py-2 rounded-xl border-l-2 border-studysphere-purple' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 font-mono text-xs font-bold text-center ${
                      node.rank === 1 ? 'text-amber-400' : node.rank === 2 ? 'text-slate-300' : 'text-amber-600'
                    }`}>
                      #{node.rank}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
                      {node.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-display">
                        {node.name}
                        {node.isSelf && <span className="ml-1.5 text-[8px] text-studysphere-purple tracking-widest font-mono font-semibold uppercase">YOU</span>}
                      </h4>
                      <span className="text-[9px] text-slate-500 font-medium">{node.level}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-300 font-mono">{node.xp}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
