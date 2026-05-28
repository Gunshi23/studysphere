'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
  Bookmark
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';

interface LogItem {
  id: string;
  type: 'focus' | 'room' | 'break' | 'quest';
  title: string;
  description: string;
  timestamp: string;
  duration?: string;
  xpAwarded: string;
  icon: React.ReactNode;
  color: 'purple' | 'blue' | 'fuchsia';
}

const mockActivityLogs: LogItem[] = [
  {
    id: '1',
    type: 'focus',
    title: 'Solo Focus: Double Integrals',
    description: 'Completed 2 consecutive Pomodoro sprint intervals in Deep Flow.',
    timestamp: 'Today, 2:15 PM',
    duration: '50 mins',
    xpAwarded: '+120 XP',
    icon: <Brain size={15} />,
    color: 'purple'
  },
  {
    id: '2',
    type: 'room',
    title: 'Joined Calculus III Study Hub',
    description: 'Collaborative group session with 4 other active student nodes.',
    timestamp: 'Today, 11:00 AM',
    duration: '1 hr 15 mins',
    xpAwarded: '+250 XP',
    icon: <Video size={15} />,
    color: 'blue'
  },
  {
    id: '3',
    type: 'quest',
    title: 'Quest Completed: "Deep Diver"',
    description: 'Logged 4+ total hours of focused learning within a 24h window.',
    timestamp: 'Yesterday, 8:45 PM',
    xpAwarded: '+500 XP',
    icon: <Award size={15} />,
    color: 'fuchsia'
  },
  {
    id: '4',
    type: 'focus',
    title: 'Solo Focus: Rust Structs',
    description: 'Revised basic struct layout, nesting, and traits implementation.',
    timestamp: 'Yesterday, 3:00 PM',
    duration: '25 mins',
    xpAwarded: '+60 XP',
    icon: <Brain size={15} />,
    color: 'purple'
  },
  {
    id: '5',
    type: 'room',
    title: 'Joined Systems Programming Room',
    description: 'Discussed systems engineering and lifetimes in async functions.',
    timestamp: 'May 26, 4:10 PM',
    duration: '45 mins',
    xpAwarded: '+150 XP',
    icon: <Video size={15} />,
    color: 'blue'
  }
];

export default function ActivityPage() {
  
  const metrics = [
    { label: 'Weekly Hours', value: '14.5 hrs', icon: <Clock size={16} className="text-studysphere-purple" />, color: 'purple' as const },
    { label: 'Sessions Run', value: '28 sessions', icon: <Brain size={16} className="text-studysphere-blue" />, color: 'blue' as const },
    { label: 'Total Quests', value: '9 completed', icon: <Award size={16} className="text-studysphere-fuchsia" />, color: 'fuchsia' as const },
    { label: 'Total XP Earned', value: '4,210 XP', icon: <Zap size={16} className="text-amber-400" />, color: 'purple' as const },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
          Activity History
          <span className="w-1.5 h-1.5 rounded-full bg-studysphere-purple animate-pulse" />
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1 font-sans">
          Log analysis and performance timeline of your study node.
        </p>
      </div>

      {/* 2. Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} glowColor={metric.color} className="flex items-center gap-4 !p-5">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              {metric.icon}
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-display">
                {metric.label}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5 font-display">
                {metric.value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Interactive Vertical Timeline Logs */}
      <Card glowColor="purple" className="!p-8">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display mb-8 flex items-center gap-2">
          <TrendingUp size={16} className="text-studysphere-purple" />
          Study Nodes Chronology
        </h3>

        {/* Timeline block */}
        <div className="relative border-l border-white/5 ml-4 pl-8 space-y-8 pb-4">
          {mockActivityLogs.map((log, idx) => {
            const glowColorStyle =
              log.color === 'purple'
                ? 'shadow-[0_0_15px_rgba(139,92,246,0.3)] border-studysphere-purple bg-purple-950 text-studysphere-purple'
                : log.color === 'blue'
                ? 'shadow-[0_0_15px_rgba(59,130,246,0.3)] border-studysphere-blue bg-blue-950 text-studysphere-blue'
                : 'shadow-[0_0_15px_rgba(217,70,239,0.3)] border-studysphere-fuchsia bg-fuchsia-950 text-studysphere-fuchsia';

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {/* Pulse dot indicator along vertical border */}
                <div
                  className={`absolute -left-12 top-1.5 w-8 h-8 rounded-xl border flex items-center justify-center text-xs transition-all ${glowColorStyle}`}
                >
                  {log.icon}
                </div>

                {/* Log card structure */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white font-display">
                        {log.title}
                      </h4>
                      {log.duration && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/5 text-slate-500 font-mono tracking-wider font-semibold">
                          {log.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans max-w-[500px]">
                      {log.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[8.5px] text-slate-500 font-mono font-medium">
                      <Calendar size={10} />
                      {log.timestamp}
                    </div>
                  </div>

                  {/* Reward nodes */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold font-mono px-3 py-1.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400`}>
                      {log.xpAwarded}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
