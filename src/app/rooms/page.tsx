'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Users,
  Video,
  Lock,
  Globe,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

interface Room {
  id: string;
  title: string;
  host: string;
  category: string;
  members: number;
  maxMembers: number;
  isPrivate: boolean;
  activeTags: string[];
}

const mockRooms: Room[] = [
  { id: '1', title: 'Calculus III Study Hub', host: 'Alex Rivera', category: 'Mathematics', members: 8, maxMembers: 12, isPrivate: false, activeTags: ['Integration', 'Collab', 'College'] },
  { id: '2', title: 'Rust Systems Programming', host: 'Sophia Chen', category: 'Computer Science', members: 4, maxMembers: 6, isPrivate: false, activeTags: ['Rust', 'Async', 'System'] },
  { id: '3', title: 'Organic Chemistry Prep', host: 'David Kim', category: 'Chemistry', members: 11, maxMembers: 15, isPrivate: false, activeTags: ['Benzene', 'Exam Prep'] },
  { id: '4', title: 'Deep Learning Research papers', host: 'Elena Rostova', category: 'Computer Science', members: 6, maxMembers: 8, isPrivate: true, activeTags: ['Transformers', 'PyTorch'] },
  { id: '5', title: 'AP European History Sprint', host: 'Marcus Aurelius', category: 'History', members: 2, maxMembers: 10, isPrivate: false, activeTags: ['WWI', 'Summaries'] },
  { id: '6', title: 'Intro to Quantum Computing', host: 'Niels Bohr', category: 'Physics', members: 3, maxMembers: 5, isPrivate: false, activeTags: ['Qubits', 'Linear Algebra'] },
];

const categories = ['All', 'Mathematics', 'Computer Science', 'Chemistry', 'Physics', 'History'];

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showOnlyPublic, setShowOnlyPublic] = useState(false);

  // Filtering Logic
  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.activeTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || room.category === selectedCategory;
    const matchesPrivacy = !showOnlyPublic || !room.isPrivate;

    return matchesSearch && matchesCategory && matchesPrivacy;
  });

  return (
    <div className="space-y-8 select-none">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
            Study Rooms
            <span className="w-1.5 h-1.5 rounded-full bg-studysphere-blue animate-pulse" />
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 font-sans">
            Join or launch collaborative virtual study rooms equipped with shared timers.
          </p>
        </div>

        <Link href="/rooms/create">
          <GlowingButton variant="primary" className="!px-6 !py-2.5 text-xs font-semibold">
            <Plus size={14} />
            Create Study Room
          </GlowingButton>
        </Link>
      </div>

      {/* 2. Filters & Search Section */}
      <Card glowColor="blue" className="!p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by room title, host, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-studysphere-blue/50 text-xs transition-all font-sans"
            />
          </div>

          {/* Privacy filter */}
          <button
            onClick={() => setShowOnlyPublic(!showOnlyPublic)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-medium font-sans cursor-pointer transition-all flex items-center justify-center gap-2 ${
              showOnlyPublic
                ? 'bg-blue-950/20 border-studysphere-blue text-studysphere-blue'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe size={13} />
            Public Only
          </button>
        </div>

        {/* Categories selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1.5 scrollbar-none">
          <Filter size={13} className="text-slate-500 flex-shrink-0" />
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold font-display tracking-wide uppercase transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-500/10 border-studysphere-blue/40 text-studysphere-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                    : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 3. Rooms Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredRooms.map((room) => {
            const isFull = room.members >= room.maxMembers;
            return (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card glowColor="blue" className="h-full flex flex-col justify-between hover:-translate-y-1">
                  <div className="space-y-4">
                    {/* Category tag & Privacy badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-500/20 text-blue-400 font-bold tracking-wide font-display">
                        {room.category}
                      </span>
                      <div className="text-slate-500 flex items-center gap-1.5">
                        {room.isPrivate ? (
                          <span className="flex items-center gap-1 text-[9px] font-semibold text-slate-500 uppercase tracking-widest font-mono">
                            <Lock size={10} />
                            Private
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[9px] font-semibold text-slate-500 uppercase tracking-widest font-mono">
                            <Globe size={10} />
                            Public
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Room Info */}
                    <div>
                      <h3 className="text-sm font-bold text-white font-display line-clamp-1">
                        {room.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Hosted by <span className="text-slate-400 font-semibold">{room.host}</span>
                      </p>
                    </div>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1">
                      {room.activeTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/5 text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Room status & action */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                    {/* Capacity Indicator bar */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                        <Users size={11} className="text-slate-500" />
                        {room.members}/{room.maxMembers} Nodes
                      </span>
                      <div className="w-24 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull ? 'bg-red-500' : 'bg-studysphere-blue'
                          }`}
                          style={{ width: `${(room.members / room.maxMembers) * 100}%` }}
                        />
                      </div>
                    </div>

                    <Link href={`/rooms/${room.id}`}>
                      <GlowingButton
                        variant="secondary"
                        className="!px-4 !py-1.5 !text-[10px] font-bold"
                        disabled={isFull}
                      >
                        Enter Room
                      </GlowingButton>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {filteredRooms.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Video size={32} className="mx-auto text-slate-600 animate-pulse" />
            <h4 className="text-slate-300 font-bold mt-4 font-display">No study nodes active</h4>
            <p className="text-slate-500 text-xs mt-1 max-w-[280px] mx-auto leading-relaxed">
              No rooms match your filter. You can initiate a new study node from the button above.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
