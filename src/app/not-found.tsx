'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import GlowingButton from '@/components/UI/GlowingButton';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#030014] text-slate-100 flex flex-col items-center justify-center relative p-6 select-none overflow-hidden">
      
      {/* 3D ambient glows */}
      <div className="absolute top-[20%] left-[25%] w-[400px] h-[400px] bg-studysphere-purple/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[25%] w-[350px] h-[350px] bg-studysphere-blue/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Cybernetic Grid details */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Content wrapper */}
      <div className="max-w-md w-full text-center space-y-8 z-10 flex flex-col items-center">
        
        {/* Animated Warning Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-2xl bg-fuchsia-950/20 border border-studysphere-fuchsia/40 flex items-center justify-center text-studysphere-fuchsia shadow-[0_0_20px_rgba(217,70,239,0.2)]"
        >
          <AlertTriangle size={32} className="animate-pulse" />
        </motion.div>

        {/* Big Code Header */}
        <div className="space-y-2">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-studysphere-purple via-studysphere-fuchsia to-studysphere-blue font-display"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-extrabold tracking-widest text-slate-300 uppercase font-display"
          >
            STUDY_NODE_OFFLINE
          </motion.h2>
        </div>

        {/* Summary Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-slate-500 font-sans leading-relaxed max-w-[280px] mx-auto"
        >
          This sector of the StudySphere is unresponsive or has been decommissioned. Check your coordinates and retry.
        </motion.p>

        {/* Navigation CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <Link href="/dashboard" className="flex-grow">
            <GlowingButton variant="primary" className="w-full !py-3 text-xs font-semibold">
              <Compass size={14} />
              Return to Dashboard
            </GlowingButton>
          </Link>
          
          <Link href="/" className="flex-grow">
            <button className="w-full py-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer transition-all flex items-center justify-center gap-2">
              Landing Page
              <ArrowRight size={13} />
            </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
