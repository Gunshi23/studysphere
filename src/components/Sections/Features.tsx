'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import { Video, MessageSquare, Timer, BarChart3, Radio, LayoutDashboard } from 'lucide-react';

export default function Features() {
  const featuresList = [
    {
      title: 'Realtime Study Rooms',
      desc: 'Join global, interactive virtual co-studying rooms with screen-shares, camera grids, and study streaks.',
      icon: <Video className="text-cyan-400" size={22} />,
      color: 'blue' as const,
      illustration: (
        <div className="relative w-full h-24 flex items-center justify-center overflow-hidden rounded-lg bg-black/30 border border-white/5 mt-4">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          <div className="flex gap-2">
            {[1, 2, 3].map((val) => (
              <motion.div
                key={val}
                animate={{ scale: [1, 1.05, 1], y: [0, -3, 0] }}
                transition={{ duration: 3, delay: val * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-xl border border-cyan-500/20 bg-slate-900 flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-cyan-300">
                  U_{val}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Live Group Chat',
      desc: 'Contextual thread-based channels to discuss problems, share code snippets, files, or find study buddies.',
      icon: <MessageSquare className="text-purple-400" size={22} />,
      color: 'purple' as const,
      illustration: (
        <div className="relative w-full h-24 flex flex-col gap-1.5 p-3 overflow-hidden rounded-lg bg-black/30 border border-white/5 mt-4">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_12px] pointer-events-none" />
          <motion.div
            animate={{ x: [-10, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5 }}
            className="self-start bg-slate-900 border border-purple-500/20 text-[9px] text-slate-300 px-2 py-1 rounded-r-lg rounded-tl-lg max-w-[80%]"
          >
            Any tips on solving linear algebra? 🤔
          </motion.div>
          <motion.div
            animate={{ x: [10, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 1 }}
            className="self-end bg-purple-950/40 border border-purple-500/40 text-[9px] text-purple-300 px-2 py-1 rounded-l-lg rounded-tr-lg max-w-[80%]"
          >
            Try matrix reduction! 📖
          </motion.div>
        </div>
      ),
    },
    {
      title: 'Pomodoro Sessions',
      desc: 'Host group Pomodoro sprints. Stay synchronized with visual countdowns and relaxing background lo-fi streams.',
      icon: <Timer className="text-fuchsia-400" size={22} />,
      color: 'fuchsia' as const,
      illustration: (
        <div className="relative w-full h-24 flex items-center justify-center overflow-hidden rounded-lg bg-black/30 border border-white/5 mt-4">
          <div className="relative w-16 h-16 rounded-full border border-fuchsia-500/20 bg-slate-950 flex items-center justify-center">
            {/* Pulsing glow dial */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0.5 rounded-full border-t border-r border-fuchsia-500"
            />
            <span className="text-[11px] font-mono text-fuchsia-400 font-bold">25:00</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Study Analytics',
      desc: 'Understand how you study. Graph focus density, efficiency cycles, and subject distributions.',
      icon: <BarChart3 className="text-cyan-400" size={22} />,
      color: 'blue' as const,
      illustration: (
        <div className="relative w-full h-24 flex items-end justify-center gap-2 p-3 overflow-hidden rounded-lg bg-black/30 border border-white/5 mt-4">
          {[20, 50, 30, 80, 45, 90].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              className="w-full bg-gradient-to-t from-cyan-500/20 to-cyan-500 rounded-t-sm"
            />
          ))}
        </div>
      ),
    },
    {
      title: 'Activity Tracking',
      desc: 'Track and log your active keyboard inputs, focus streaks, and daily checklist challenges.',
      icon: <Radio className="text-purple-400" size={22} />,
      color: 'purple' as const,
      illustration: (
        <div className="relative w-full h-24 flex items-center justify-center overflow-hidden rounded-lg bg-black/30 border border-white/5 mt-4">
          {/* Pulsing signal rings */}
          <div className="relative w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <motion.div
              animate={{ scale: [1, 3.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border border-purple-500"
            />
            <motion.div
              animate={{ scale: [1, 3.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, delay: 1, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border border-purple-500"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Productivity Dashboard',
      desc: 'Organize study files, embed templates, manage todos, and sync with your digital calendars.',
      icon: <LayoutDashboard className="text-fuchsia-400" size={22} />,
      color: 'fuchsia' as const,
      illustration: (
        <div className="relative w-full h-24 grid grid-cols-3 gap-2 p-2 overflow-hidden rounded-lg bg-black/30 border border-white/5 mt-4">
          <div className="col-span-2 bg-slate-900/60 border border-white/5 rounded-md p-1.5 flex flex-col justify-between">
            <span className="w-10 h-1.5 bg-slate-800 rounded" />
            <span className="w-full h-2 bg-fuchsia-500/20 rounded" />
            <span className="w-4/5 h-2 bg-slate-800 rounded" />
          </div>
          <div className="bg-slate-900/60 border border-white/5 rounded-md p-1.5 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-fuchsia-500/40 flex items-center justify-center text-[10px] text-fuchsia-300 font-bold">
              88%
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto w-full z-10">
      
      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studysphere-purple/10 border border-studysphere-purple/20 mb-4"
        >
          <span className="text-[10px] tracking-widest text-studysphere-purple font-bold uppercase">CAPABILITIES</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-6"
        >
          Engineered for Deep Focus
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base md:text-lg"
        >
          StudySphere integrates study tracking tools directly into virtual rooms to eliminate context switching and keep you focused.
        </motion.p>
      </div>

      {/* Feature card grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuresList.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
          >
            <Card glowColor={feat.color} className="h-full flex flex-col justify-between p-6">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-white/[0.02] border border-white/5 mb-5 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed mb-4">{feat.desc}</p>
              </div>
              {feat.illustration}
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
