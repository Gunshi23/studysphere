'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ShowcaseCanvas from '../ThreeCanvas/ShowcaseCanvas';
import ClientOnly from '../ClientOnly';

export default function Showcase() {
  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto w-full z-10 select-none">
      
      {/* Ambient purple-blue glow background behind the 3D scene */}
      <div className="absolute top-[30%] right-[10%] w-[40vw] h-[40vw] bg-studysphere-blue/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-neon-pulse" />

      {/* Header Description */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studysphere-blue/10 border border-studysphere-blue/20 mb-4"
        >
          <span className="text-[10px] tracking-widest text-studysphere-blue font-bold uppercase">INTERACTIVE ENVIRONMENT</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-6"
        >
          Your Virtual Study Desk
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base md:text-lg"
        >
          Explore and customize your virtual workspace. Drag to rotate, scroll to zoom, and click the buttons on the screen to control the live Pomodoro timer.
        </motion.p>
      </div>

      {/* 3D Canvas element */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full"
      >
        <ClientOnly fallback={
          <div className="w-full h-[550px] relative rounded-2xl overflow-hidden bg-slate-950/60 border border-white/5 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <span className="text-xs text-slate-500 font-semibold tracking-widest uppercase">LOADING 3D WORLD...</span>
            </div>
          </div>
        }>
          <ShowcaseCanvas />
        </ClientOnly>
      </motion.div>
    </section>
  );
}
