'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlowingButton from '../UI/GlowingButton';
import HeroCanvas from '../ThreeCanvas/HeroCanvas';
import ClientOnly from '../ClientOnly';
import { ArrowRight, Compass } from 'lucide-react';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 select-none">
      
      {/* 3D Dynamic Background */}
      <ClientOnly fallback={<div className="absolute inset-0 bg-[#030014] -z-10" />}>
        <HeroCanvas />
      </ClientOnly>

      {/* Pulsing neon backing orbs to enhance canvas lighting */}
      <div className="absolute top-[20%] left-[20%] w-[35vw] h-[35vw] bg-studysphere-purple/20 rounded-full blur-[120px] pointer-events-none animate-neon-pulse -z-10" />
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-studysphere-blue/20 rounded-full blur-[100px] pointer-events-none animate-neon-pulse -z-10" style={{ animationDelay: '4s' }} />

      {/* Interactive content grid */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Holographic Header Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-studysphere-fuchsia animate-pulse" />
          <span className="text-[10px] tracking-widest text-slate-300 font-bold uppercase">StudySphere v2.0 is live</span>
        </motion.div>

        {/* Cinematic Title Reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-none"
        >
          <span className="text-white">Study Together.</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-studysphere-purple via-studysphere-fuchsia to-studysphere-blue font-display">
            Stay Consistent.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A collaborative virtual study room platform built for focused learning,
          deep community flow states, and automated productivity tracking.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/login" className="w-full sm:w-auto">
            <GlowingButton variant="primary" className="w-full">
              Start Studying <ArrowRight size={16} />
            </GlowingButton>
          </Link>
          <GlowingButton variant="secondary">
            <Compass size={16} className="text-studysphere-purple" /> Explore Rooms
          </GlowingButton>
        </motion.div>
      </div>

      {/* Animated scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 hover:opacity-90 transition-opacity duration-300">
        <span className="text-[9px] tracking-widest text-slate-500 font-bold uppercase">EXPLORE ROOMS</span>
        <div className="w-5 h-8 rounded-full border border-slate-700 flex justify-center p-1">
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1.5 h-1.5 bg-studysphere-purple rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
