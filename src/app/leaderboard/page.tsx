'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  TrendingUp,
  Search,
  Sparkles,
  Crown,
  Timer
} from 'lucide-react';
import Card from '@/components/UI/Card';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  level: string;
  weeklyHours: string;
  streak: number;
  xp: string;
  isSelf?: boolean;
}

const weeklyStandings: LeaderboardUser[] = [
  { rank: 1, name: 'Sophia Chen', avatar: 'SC', level: 'Lv. 14', weeklyHours: '18.4 hrs', streak: 12, xp: '4,850 XP' },
  { rank: 2, name: 'Lucas Miller', avatar: 'LM', level: 'Lv. 12', weeklyHours: '14.5 hrs', streak: 5, xp: '4,210 XP', isSelf: true },
  { rank: 3, name: 'Yuki Tanaka', avatar: 'YT', level: 'Lv. 11', weeklyHours: '12.8 hrs', streak: 8, xp: '3,980 XP' },
  { rank: 4, name: 'Alex Rivera', avatar: 'AR', level: 'Lv. 13', weeklyHours: '11.2 hrs', streak: 4, xp: '3,540 XP' },
  { rank: 5, name: 'Elena Rostova', avatar: 'ER', level: 'Lv. 10', weeklyHours: '9.5 hrs', streak: 7, xp: '3,120 XP' },
  { rank: 6, name: 'David Kim', avatar: 'DK', level: 'Lv. 9', weeklyHours: '8.4 hrs', streak: 3, xp: '2,890 XP' },
  { rank: 7, name: 'Marcus Aurelius', avatar: 'MA', level: 'Lv. 15', weeklyHours: '7.8 hrs', streak: 1, xp: '2,650 XP' },
];

const allTimeStandings: LeaderboardUser[] = [
  { rank: 1, name: 'Marcus Aurelius', avatar: 'MA', level: 'Lv. 28', weeklyHours: '142 hrs', streak: 1, xp: '38,650 XP' },
  { rank: 2, name: 'Sophia Chen', avatar: 'SC', level: 'Lv. 24', weeklyHours: '118 hrs', streak: 12, xp: '32,850 XP' },
  { rank: 3, name: 'Alex Rivera', avatar: 'AR', level: 'Lv. 22', weeklyHours: '102 hrs', streak: 4, xp: '29,540 XP' },
  { rank: 4, name: 'Lucas Miller', avatar: 'LM', level: 'Lv. 20', weeklyHours: '98 hrs', streak: 5, xp: '27,210 XP', isSelf: true },
  { rank: 5, name: 'Yuki Tanaka', avatar: 'YT', level: 'Lv. 19', weeklyHours: '89 hrs', streak: 8, xp: '25,980 XP' },
  { rank: 6, name: 'Elena Rostova', avatar: 'ER', level: 'Lv. 18', weeklyHours: '82 hrs', streak: 7, xp: '24,120 XP' },
  { rank: 7, name: 'David Kim', avatar: 'DK', level: 'Lv. 15', weeklyHours: '64 hrs', streak: 3, xp: '19,890 XP' },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  const activeStandings = tab === 'weekly' ? weeklyStandings : allTimeStandings;

  const filteredStandings = activeStandings.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Top 3 nodes extraction
  const podium1 = activeStandings.find(u => u.rank === 1);
  const podium2 = activeStandings.find(u => u.rank === 2);
  const podium3 = activeStandings.find(u => u.rank === 3);

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
            Leaderboard
            <span className="w-1.5 h-1.5 rounded-full bg-studysphere-fuchsia animate-pulse" />
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 font-sans">
            Weekly and lifetime rankings based on study efficiency and XP milestones.
          </p>
        </div>

        {/* League Rank Level Card */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-fuchsia-950/20 border border-fuchsia-500/20 shadow-inner">
          <Trophy size={16} className="text-studysphere-fuchsia fill-studysphere-fuchsia" />
          <div>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider font-display block">CURRENT LEAGUE</span>
            <span className="text-xs font-bold text-fuchsia-300 font-display">DIAMOND TIER • #2 NODE</span>
          </div>
        </div>
      </div>

      {/* 2. Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* Podium 2nd Place */}
        {podium2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-2 md:order-1"
          >
            <Card glowColor="purple" className="text-center p-6 flex flex-col items-center border-slate-700/50">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-sm text-slate-300 relative shadow-inner">
                {podium2.avatar}
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-slate-400">
                  <Crown size={14} className="fill-slate-400" />
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-4 font-display flex items-center gap-1.5">
                {podium2.name}
                {podium2.isSelf && <span className="text-[7px] px-1 bg-studysphere-purple rounded text-white font-mono uppercase tracking-widest">YOU</span>}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{podium2.level}</p>
              <div className="flex justify-between w-full border-t border-white/5 pt-4 mt-4 text-[10px] font-mono">
                <span className="text-slate-500">STUDY</span>
                <span className="text-slate-300 font-bold">{podium2.weeklyHours}</span>
              </div>
              <div className="flex justify-between w-full mt-1.5 text-[10px] font-mono">
                <span className="text-slate-500">XP NODE</span>
                <span className="text-studysphere-purple font-extrabold">{podium2.xp}</span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 font-mono mt-4 px-2.5 py-1 rounded bg-slate-850 border border-slate-750 uppercase tracking-widest">
                RANK #2
              </span>
            </Card>
          </motion.div>
        )}

        {/* Podium 1st Place */}
        {podium1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-1 md:order-2 md:pb-4"
          >
            <Card glowColor="fuchsia" className="text-center p-8 flex flex-col items-center border-studysphere-fuchsia/30 relative">
              {/* Backglow highlight */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-studysphere-fuchsia/5 rounded-full blur-2xl pointer-events-none -z-10" />

              <div className="w-16 h-16 rounded-xl bg-fuchsia-950/20 border border-studysphere-fuchsia/30 flex items-center justify-center font-bold text-base text-fuchsia-400 relative shadow-inner">
                {podium1.avatar}
                <span className="absolute -top-4.5 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce">
                  <Crown size={20} className="fill-amber-400" />
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-4 font-display flex items-center gap-1.5">
                {podium1.name}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{podium1.level}</p>
              <div className="flex justify-between w-full border-t border-white/5 pt-4 mt-4 text-[10px] font-mono">
                <span className="text-slate-500">STUDY</span>
                <span className="text-slate-300 font-bold">{podium1.weeklyHours}</span>
              </div>
              <div className="flex justify-between w-full mt-1.5 text-[10px] font-mono">
                <span className="text-slate-500">XP NODE</span>
                <span className="text-studysphere-fuchsia font-extrabold">{podium1.xp}</span>
              </div>
              <span className="text-[10px] font-bold text-fuchsia-400 font-mono mt-4 px-3 py-1.5 rounded-lg bg-fuchsia-950/30 border border-fuchsia-500/25 uppercase tracking-widest shadow-[0_0_15px_rgba(217,70,239,0.15)]">
                CHAMPION #1
              </span>
            </Card>
          </motion.div>
        )}

        {/* Podium 3rd Place */}
        {podium3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-3"
          >
            <Card glowColor="purple" className="text-center p-6 flex flex-col items-center border-slate-700/50">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-650 flex items-center justify-center font-bold text-sm text-amber-700 relative shadow-inner">
                {podium3.avatar}
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-amber-700">
                  <Crown size={14} className="fill-amber-700" />
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-4 font-display flex items-center gap-1.5">
                {podium3.name}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{podium3.level}</p>
              <div className="flex justify-between w-full border-t border-white/5 pt-4 mt-4 text-[10px] font-mono">
                <span className="text-slate-500">STUDY</span>
                <span className="text-slate-300 font-bold">{podium3.weeklyHours}</span>
              </div>
              <div className="flex justify-between w-full mt-1.5 text-[10px] font-mono">
                <span className="text-slate-500">XP NODE</span>
                <span className="text-studysphere-purple font-extrabold">{podium3.xp}</span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 font-mono mt-4 px-2.5 py-1 rounded bg-slate-850 border border-slate-750 uppercase tracking-widest">
                RANK #3
              </span>
            </Card>
          </motion.div>
        )}
      </div>

      {/* 3. Filter Controls & Search bar */}
      <Card glowColor="purple" className="!p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab selectors */}
          <div className="flex gap-2 p-1 rounded-xl bg-[#030014]/60 border border-white/5 w-fit">
            <button
              onClick={() => setTab('weekly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold font-display tracking-wider cursor-pointer transition-all ${
                tab === 'weekly'
                  ? 'bg-purple-950/40 text-studysphere-purple border border-purple-500/20'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              Weekly Sprint
            </button>
            <button
              onClick={() => setTab('alltime')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold font-display tracking-wider cursor-pointer transition-all ${
                tab === 'alltime'
                  ? 'bg-purple-950/40 text-studysphere-purple border border-purple-500/20'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              Lifetime Nodes
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Search user node..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-studysphere-purple/50 text-xs transition-all font-sans"
            />
          </div>
        </div>

        {/* Standings Table inside glassmorphic card */}
        <div className="overflow-x-auto w-full pt-2">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 font-mono tracking-wider font-bold text-[9px] uppercase">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Node Name</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Focus Hours</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4 text-right">XP Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStandings.map((user) => (
                <tr
                  key={user.name}
                  className={`transition-colors hover:bg-white/[0.01] ${
                    user.isSelf ? 'bg-purple-950/15 border-l-2 border-studysphere-purple' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">
                    #{user.rank}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-300">
                      {user.avatar}
                    </div>
                    <span className="font-bold text-white font-display flex items-center gap-1.5">
                      {user.name}
                      {user.isSelf && <span className="text-[7px] px-1 bg-studysphere-purple rounded text-white font-mono uppercase tracking-widest font-semibold">YOU</span>}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{user.level}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{user.weeklyHours}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-300 font-mono">
                      <Flame size={12} className="text-studysphere-purple fill-studysphere-purple" />
                      {user.streak} days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-200">
                    {user.xp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
