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
  Filter,
  Bookmark,
  Calendar,
  Compass,
  Zap,
  Activity
} from 'lucide-react';
import Card from '@/components/UI/Card';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

interface Room {
  id: string;
  title: string;
  description: string;
  host: string;
  hostAvatar: string;
  category: string;
  members: number;
  maxMembers: number;
  onlineCount: number;
  isActive: boolean;
  isPrivate: boolean;
  isJoined: boolean;
  lastActive: string;
  activeTags: string[];
}

const mockRooms: Room[] = [
  {
    id: '1',
    title: 'Calculus III Study Hub',
    description: 'Crushing double integrals, Stokes theorem proofs, and preparing for the final exam sync.',
    host: 'Alex Rivera',
    hostAvatar: 'AR',
    category: 'Mathematics',
    members: 8,
    maxMembers: 12,
    onlineCount: 4,
    isActive: true,
    isPrivate: false,
    isJoined: true,
    lastActive: '5 mins ago',
    activeTags: ['Integration', 'Collab', 'College']
  },
  {
    id: '2',
    title: 'Rust Systems Programming',
    description: 'Deep dive into lifetimes, concurrency nodes, tokio async flows, and systems engineering.',
    host: 'Sophia Chen',
    hostAvatar: 'SC',
    category: 'Computer Science',
    members: 4,
    maxMembers: 6,
    onlineCount: 3,
    isActive: true,
    isPrivate: false,
    isJoined: true,
    lastActive: '10 mins ago',
    activeTags: ['Rust', 'Async', 'System']
  },
  {
    id: '3',
    title: 'Organic Chemistry Prep',
    description: 'Synthesizing organic structures, benzene reactions mechanisms, and molecular geometries.',
    host: 'David Kim',
    hostAvatar: 'DK',
    category: 'Chemistry',
    members: 11,
    maxMembers: 15,
    onlineCount: 2,
    isActive: false,
    isPrivate: false,
    isJoined: false,
    lastActive: '1 hour ago',
    activeTags: ['Benzene', 'Exam Prep']
  },
  {
    id: '4',
    title: 'Deep Learning Research papers',
    description: 'Reading transformers weights architectures, attention mechanisms, and CNN layer optimization.',
    host: 'Elena Rostova',
    hostAvatar: 'ER',
    category: 'Computer Science',
    members: 6,
    maxMembers: 8,
    onlineCount: 1,
    isActive: true,
    isPrivate: true,
    isJoined: false,
    lastActive: '2 mins ago',
    activeTags: ['Transformers', 'PyTorch']
  },
  {
    id: '5',
    title: 'AP European History Sprint',
    description: 'Synthesizing timeline maps, industrial revolutions impacts, and WWI alliances structures.',
    host: 'Marcus Aurelius',
    hostAvatar: 'MA',
    category: 'History',
    members: 2,
    maxMembers: 10,
    onlineCount: 0,
    isActive: false,
    isPrivate: false,
    isJoined: false,
    lastActive: '3 hours ago',
    activeTags: ['WWI', 'Summaries']
  },
  {
    id: '6',
    title: 'Intro to Quantum Computing',
    description: 'Superposition systems, qubit gates matrices, linear algebra models, and Shor algorithm.',
    host: 'Niels Bohr',
    hostAvatar: 'NB',
    category: 'Physics',
    members: 3,
    maxMembers: 5,
    onlineCount: 2,
    isActive: true,
    isPrivate: false,
    isJoined: true,
    lastActive: '20 mins ago',
    activeTags: ['Qubits', 'Linear Algebra']
  },
];

const categories = ['All', 'Mathematics', 'Computer Science', 'Chemistry', 'Physics', 'History'];

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'joined' | 'public' | 'private'>('all');

  // Filtering Logic
  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.activeTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || room.category === selectedCategory;
    
    let matchesFilter = true;
    if (activeFilter === 'active') matchesFilter = room.isActive;
    else if (activeFilter === 'joined') matchesFilter = room.isJoined;
    else if (activeFilter === 'public') matchesFilter = !room.isPrivate;
    else if (activeFilter === 'private') matchesFilter = room.isPrivate;

    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div className="space-y-8 select-none relative pb-12">
      {/* Cinematic animated glows */}
      <div className="absolute top-[5%] right-[20%] w-[350px] h-[350px] bg-studysphere-blue/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-neon-pulse" />
      <div className="absolute bottom-[5%] left-[10%] w-[300px] h-[300px] bg-studysphere-purple/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-neon-pulse" style={{ animationDelay: '4s' }} />

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
      <Card glowColor="blue" className="!p-5 space-y-4 border-white/5 relative">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by room title, host, description, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#030014]/60 border border-white/5 text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-studysphere-blue/50 text-xs transition-all font-sans"
            />
          </div>

          {/* Quick Filters Group */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {(['all', 'active', 'joined', 'public', 'private'] as const).map((filterOpt) => (
              <button
                key={filterOpt}
                onClick={() => setActiveFilter(filterOpt)}
                className={`px-3 py-2 rounded-xl border text-[10px] font-bold font-display uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${
                  activeFilter === filterOpt
                    ? 'bg-blue-950/20 border-studysphere-blue text-studysphere-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                    : 'bg-white/[0.01] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                }`}
              >
                {filterOpt === 'all' && 'All'}
                {filterOpt === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />}
                {filterOpt === 'active' && 'Live Active'}
                {filterOpt === 'joined' && 'Joined Nodes'}
                {filterOpt === 'public' && 'Public'}
                {filterOpt === 'private' && 'Private'}
              </button>
            ))}
          </div>
        </div>

        {/* Categories selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1.5 border-t border-white/5 scrollbar-none">
          <Filter size={13} className="text-slate-500 flex-shrink-0" />
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold font-display tracking-wide uppercase transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-500/10 border-studysphere-blue/40 text-studysphere-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                    : 'bg-white/[0.01] border-white/5 text-slate-500 hover:text-slate-350'
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
                <Card glowColor="blue" className="h-full flex flex-col justify-between hover:-translate-y-1 relative group border-white/5">
                  
                  {/* Glowing live active highlight overlay */}
                  {room.isActive && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -z-10 group-hover:bg-emerald-500/10 transition-colors" />
                  )}

                  <div className="space-y-4">
                    {/* Category tag & Privacy badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-500/20 text-blue-400 font-bold tracking-wide font-display">
                        {room.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {room.isActive && (
                          <span className="flex items-center gap-1 text-[8.5px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/20 text-emerald-400 font-mono font-bold tracking-widest uppercase animate-pulse">
                            Live
                          </span>
                        )}
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
                      <h3 className="text-sm font-bold text-white font-display line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-studysphere-blue transition-all">
                        {room.title}
                      </h3>
                      
                      {/* Host Profile Info */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-5.5 h-5.5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[8px] text-slate-300">
                          {room.hostAvatar}
                        </div>
                        <span className="text-[10px] text-slate-500 font-sans">
                          Hosted by <span className="text-slate-400 font-semibold">{room.host}</span>
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-3 line-clamp-2 h-8.5">
                        {room.description}
                      </p>
                    </div>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1">
                      {room.activeTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/5 text-slate-500"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Room status & action */}
                  <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-white/5">
                    {/* Capacity Indicator bar & online counts */}
                    <div className="flex items-center justify-between">
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

                      {/* Online count */}
                      <span className="text-[9px] text-slate-500 font-mono font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {room.onlineCount} online
                      </span>
                    </div>

                    {/* Buttons row */}
                    <div className="flex items-center justify-between gap-3 text-[9px] font-mono font-bold text-slate-500">
                      <span>ACTIVE {room.lastActive}</span>
                      
                      <div className="flex gap-2">
                        <Link href={`/rooms/${room.id}`}>
                          <button className="px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] text-[9.5px] font-bold text-slate-400 hover:text-slate-200 cursor-pointer">
                            View Room
                          </button>
                        </Link>
                        
                        <Link href={`/rooms/${room.id}`}>
                          <GlowingButton
                            variant="secondary"
                            className="!px-4 !py-1.5 !text-[9.5px] font-bold border-studysphere-blue/30 text-studysphere-blue hover:bg-studysphere-blue/10"
                            disabled={isFull}
                          >
                            Join Room
                          </GlowingButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {filteredRooms.length === 0 && (
          <div className="col-span-full py-16 text-center flex flex-col items-center justify-center">
            {/* Animated empty illustration */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-blue-950/20 border border-studysphere-blue/30 flex items-center justify-center text-studysphere-blue relative shadow-inner mb-6"
            >
              <Video size={28} className="animate-pulse" />
            </motion.div>
            <h4 className="text-slate-350 font-bold font-display uppercase tracking-wide">No active study lobbies found</h4>
            <p className="text-slate-500 text-xs mt-1.5 max-w-[280px] mx-auto leading-relaxed font-sans">
              No matching rooms are active right now. Secure your learning goals by initiating your own study lobby.
            </p>
            
            <Link href="/rooms/create" className="mt-6">
              <GlowingButton variant="primary" className="!px-5 !py-2.5 text-xs font-semibold">
                Create Your First Room
              </GlowingButton>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
