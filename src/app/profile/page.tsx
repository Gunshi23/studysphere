'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Target,
  Sparkles,
  Award,
  Zap,
  Flame,
  Clock,
  Save,
  Check
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import { useAuth } from '@/providers/AuthProvider';

interface Badge {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'neon';
}

const mockBadges: Badge[] = [
  { name: 'Early Bird', description: 'Log a study session before 7:00 AM.', icon: '🌅', unlocked: true, tier: 'bronze' },
  { name: 'Deep Work', description: 'Study for 4 consecutive focus intervals.', icon: '🧠', unlocked: true, tier: 'silver' },
  { name: 'Node Host', description: 'Create a study room with 10+ capacity.', icon: '🌐', unlocked: true, tier: 'gold' },
  { name: 'Zen Master', description: 'Log 50+ total hours in StudySphere.', icon: '🧘', unlocked: false, tier: 'neon' },
  { name: 'System Monk', description: 'Complete a study sprint in Computer Science.', icon: '💻', unlocked: true, tier: 'bronze' },
  { name: 'Flame Lord', description: 'Maintain a 10+ day focus streak.', icon: '🔥', unlocked: false, tier: 'neon' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || 'Lucas Miller');
  const [email] = useState(user?.email || 'lucas@gmail.com');
  const [studyGoal, setStudyGoal] = useState('15'); // hours/week
  const [nodeColor, setNodeColor] = useState('purple'); // purple, blue, fuchsia
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    // Simulate API update call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setLoading(false);
    setSuccess(true);
    
    // Reset success banner after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return 'border-amber-500 text-amber-500 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
      case 'silver':
        return 'border-slate-400 text-slate-400 bg-slate-400/10';
      case 'neon':
        return 'border-studysphere-fuchsia text-studysphere-fuchsia bg-fuchsia-950/20 shadow-[0_0_10px_rgba(217,70,239,0.2)]';
      default:
        return 'border-amber-700 text-amber-700 bg-amber-700/10';
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header Overview */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
          My Profile
          <span className="w-1.5 h-1.5 rounded-full bg-studysphere-purple animate-pulse" />
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1 font-sans">
          Manage your personal study node configuration and review accomplishments.
        </p>
      </div>

      {/* 2. Split layout structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Stats & Badges Grid (7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Quick Metrics display */}
          <div className="grid grid-cols-3 gap-4">
            <Card glowColor="purple" className="text-center !p-4 flex flex-col items-center">
              <Clock size={16} className="text-studysphere-purple mb-1.5" />
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider font-display">HOURS TOTAL</span>
              <h4 className="text-sm font-bold text-white mt-0.5 font-mono">32.4h</h4>
            </Card>
            <Card glowColor="blue" className="text-center !p-4 flex flex-col items-center">
              <Flame size={16} className="text-studysphere-blue mb-1.5" />
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider font-display">STREAK</span>
              <h4 className="text-sm font-bold text-white mt-0.5 font-mono">5 Days</h4>
            </Card>
            <Card glowColor="fuchsia" className="text-center !p-4 flex flex-col items-center">
              <Award size={16} className="text-studysphere-fuchsia mb-1.5" />
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider font-display">LEVEL</span>
              <h4 className="text-sm font-bold text-white mt-0.5 font-mono">Lv. 12</h4>
            </Card>
          </div>

          {/* Achievements showcase card */}
          <Card glowColor="purple" className="!p-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display mb-6 flex items-center gap-1.5">
              <Award size={14} className="text-studysphere-purple" />
              Unlocked Nodes (Achievements)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mockBadges.map((badge) => (
                <div
                  key={badge.name}
                  className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                    badge.unlocked
                      ? getTierColor(badge.tier)
                      : 'border-white/5 bg-white/[0.01] text-slate-600 opacity-40'
                  }`}
                >
                  <span className="text-2xl mb-2">{badge.icon}</span>
                  <h4 className="text-[10px] font-bold font-display uppercase tracking-wider">{badge.name}</h4>
                  <p className="text-[8px] text-slate-500 leading-tight mt-1.5">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Profile settings Form (5 Columns) */}
        <div className="lg:col-span-5">
          <Card glowColor="purple" className="!p-8 h-full">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display mb-6 flex items-center gap-1.5">
              <User size={14} className="text-studysphere-purple" />
              Node Configuration
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Display Name */}
              <div className="space-y-2">
                <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                  <User size={12} className="text-studysphere-purple" />
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-200 focus:outline-none focus:border-studysphere-purple/50 text-xs transition-all font-sans"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Mail size={12} className="text-studysphere-purple" />
                  Associated Email
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#030014]/30 border border-white/5 text-slate-500 focus:outline-none text-xs transition-all font-sans cursor-not-allowed"
                />
              </div>

              {/* Study Goal slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                    <Target size={12} className="text-studysphere-purple" />
                    Weekly Focus Goal
                  </label>
                  <span className="text-[10px] font-mono font-bold text-studysphere-purple">{studyGoal} hours</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={studyGoal}
                  onChange={(e) => setStudyGoal(e.target.value)}
                  className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-studysphere-purple"
                />
                <div className="flex justify-between text-[7px] text-slate-600 font-mono font-bold">
                  <span>5 HOURS</span>
                  <span>20 HOURS</span>
                  <span>40 HOURS</span>
                </div>
              </div>

              {/* Node Color selectors */}
              <div className="space-y-2">
                <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-display">
                  Node Mesh Glow Color
                </label>
                <div className="flex gap-3">
                  {['purple', 'blue', 'fuchsia'].map((color) => {
                    const bgStyle =
                      color === 'purple'
                        ? 'bg-studysphere-purple'
                        : color === 'blue'
                        ? 'bg-studysphere-blue'
                        : 'bg-studysphere-fuchsia';
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNodeColor(color)}
                        className={`w-7 h-7 rounded-full ${bgStyle} border-2 flex items-center justify-center cursor-pointer transition-all ${
                          nodeColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        {nodeColor === color && <Check size={12} className="text-white font-bold" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action and Banner status */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <GlowingButton
                  type="submit"
                  variant="primary"
                  className="w-full !py-2.5 text-xs font-semibold"
                  disabled={loading}
                >
                  <Save size={13} />
                  {loading ? 'Saving Options...' : 'Update Node Config'}
                </GlowingButton>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold text-center flex items-center justify-center gap-1.5 font-sans"
                  >
                    <Check size={12} />
                    Profile node settings updated successfully!
                  </motion.div>
                )}
              </div>

            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}
