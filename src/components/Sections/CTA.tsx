'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GlowingButton from '../UI/GlowingButton';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-32 px-6 max-w-5xl mx-auto w-full text-center z-10 overflow-hidden select-none">
      
      {/* Background massive glowing neon backing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-r from-studysphere-purple via-studysphere-fuchsia to-studysphere-blue rounded-full blur-[140px] opacity-25 animate-neon-pulse pointer-events-none -z-10" />

      {/* Floating particles elements */}
      <div className="absolute top-[20%] left-[15%] w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping opacity-60 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-3.5 h-3.5 bg-purple-500 rounded-full animate-float opacity-40 pointer-events-none" />

      <div className="max-w-2xl mx-auto relative">
        
        {/* Sparkles tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6"
        >
          <Sparkles className="text-yellow-500" size={12} />
          <span className="text-[9px] tracking-widest text-slate-300 font-bold uppercase">JOIN THE COMMUNITY</span>
        </motion.div>

        {/* Text Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
        >
          Build Your Ultimate
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-studysphere-purple via-studysphere-fuchsia to-studysphere-blue font-display">
            Study Space.
          </span>
        </motion.h2>

        {/* Description paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-400 text-sm md:text-base mb-10 max-w-lg mx-auto font-light leading-relaxed"
        >
          Unlock your true focus potential. Join thousands of students hosting study rooms, setting Pomodoro cycles, and completing learning milestones together.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex justify-center"
        >
          <Link href="/login">
            <GlowingButton variant="primary" className="px-10 py-4 text-sm tracking-widest font-bold">
              START STUDYING NOW <ArrowRight size={16} />
            </GlowingButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
