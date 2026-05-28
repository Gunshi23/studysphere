'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Settings,
  Shield,
  Users,
  Video,
  Globe,
  Lock,
  Sparkles,
  Bookmark
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

export default function CreateRoomPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mathematics');
  const [maxMembers, setMaxMembers] = useState(8);
  const [isPrivate, setIsPrivate] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [focusType, setFocusType] = useState('pomodoro'); // pomodoro, free
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    // Simulate API call to create room node
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    
    // Redirect to rooms list (in a real app, redirects to the newly created room id)
    router.push('/rooms');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 select-none">
      {/* Back Button */}
      <Link href="/rooms" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors">
        <ArrowLeft size={14} />
        Back to Study Rooms
      </Link>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
          Launch Study Node
          <Sparkles size={16} className="text-studysphere-purple animate-pulse" />
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-sans">
          Configure and deploy a new collaborative focus room.
        </p>
      </div>

      {/* Main Creation Card Form */}
      <Card glowColor="purple" className="!p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Room Title */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
              <Video size={13} className="text-studysphere-purple" />
              Room Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Calculus III Exam Prep Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-studysphere-purple/50 text-xs transition-all font-sans"
            />
          </div>

          {/* Grid fields: Category & Focus Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                <Bookmark size={13} className="text-studysphere-purple" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-300 focus:outline-none focus:border-studysphere-purple/50 text-xs transition-all font-sans appearance-none cursor-pointer"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="History">History</option>
                <option value="Languages">Languages</option>
              </select>
            </div>

            {/* Focus Session Type */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                <Settings size={13} className="text-studysphere-purple" />
                Focus Mode
              </label>
              <select
                value={focusType}
                onChange={(e) => setFocusType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-300 focus:outline-none focus:border-studysphere-purple/50 text-xs transition-all font-sans appearance-none cursor-pointer"
              >
                <option value="pomodoro">Pomodoro (25m Focus / 5m Break)</option>
                <option value="free">Free Flow (Continuous Clock)</option>
              </select>
            </div>
          </div>

          {/* Grid fields: Seat Limit & Privacy Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seat Limits */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Users size={13} className="text-studysphere-purple" />
                  Seat Capacity
                </label>
                <span className="text-[10px] font-mono font-bold text-studysphere-purple">{maxMembers} Nodes</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                value={maxMembers}
                onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-studysphere-purple"
              />
              <div className="flex justify-between text-[8px] text-slate-600 font-mono font-bold">
                <span>2 SEATS</span>
                <span>10 SEATS</span>
                <span>20 SEATS</span>
              </div>
            </div>

            {/* Privacy Select */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
                <Shield size={13} className="text-studysphere-purple" />
                Privacy Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Public Selector */}
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={`py-2 px-3.5 rounded-xl border text-xs font-semibold font-display tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    !isPrivate
                      ? 'bg-purple-950/20 border-studysphere-purple text-studysphere-purple shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <Globe size={13} />
                  Public
                </button>
                {/* Private Selector */}
                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={`py-2 px-3.5 rounded-xl border text-xs font-semibold font-display tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isPrivate
                      ? 'bg-purple-950/20 border-studysphere-purple text-studysphere-purple shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <Lock size={13} />
                  Private
                </button>
              </div>
            </div>
          </div>

          {/* Subject Tags */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">
              Subject Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. integration, homework, chapter-3"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-studysphere-purple/50 text-xs transition-all font-sans"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
            <Link href="/rooms">
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl border border-white/5 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] cursor-pointer transition-all"
              >
                Cancel
              </button>
            </Link>
            
            <GlowingButton
              type="submit"
              variant="primary"
              className="!px-6 !py-2.5 text-xs font-semibold"
              disabled={loading}
            >
              {loading ? 'Initializing Node...' : 'Launch Room Node'}
            </GlowingButton>
          </div>

        </form>
      </Card>
    </div>
  );
}
