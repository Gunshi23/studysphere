'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { PlusCircle, UserPlus, Flame } from 'lucide-react';

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Smooth the path scroll progress
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const steps = [
    {
      num: '01',
      title: 'Create Your Space',
      desc: 'Create a customized study room in one click. Pick an aesthetic background theme, choose your lo-fi focus playlists, and configure the room rules.',
      icon: <PlusCircle className="text-cyan-400" size={24} />,
      colorClass: 'from-cyan-500 to-blue-500',
    },
    {
      num: '02',
      title: 'Invite Study Buddies',
      desc: 'Share your room link with school friends or open it to the public community. Study together with synchronized chat, audio channels, and screen-sharing.',
      icon: <UserPlus className="text-purple-400" size={24} />,
      colorClass: 'from-purple-500 to-fuchsia-500',
    },
    {
      num: '03',
      title: 'Activate Flow State',
      desc: 'Start the group Pomodoro timer, track active keyboard strokes to block distracted tabs, and log XP points to rise in global leaderboards.',
      icon: <Flame className="text-fuchsia-400" size={24} />,
      colorClass: 'from-fuchsia-500 to-cyan-500',
    },
  ];

  return (
    <section ref={containerRef} className="relative py-28 px-6 max-w-5xl mx-auto w-full z-10 select-none">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studysphere-fuchsia/10 border border-studysphere-fuchsia/20 mb-4"
        >
          <span className="text-[10px] tracking-widest text-studysphere-fuchsia font-bold uppercase">WORKFLOW</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-6"
        >
          How StudySphere Works
        </motion.h2>
      </div>

      {/* Steps Timeline Grid Container */}
      <div className="relative">
        
        {/* Central Vertical SVG Connecting line */}
        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 -z-10">
          {/* Static Background track */}
          <div className="absolute inset-0 bg-white/5 rounded-full" />
          
          {/* Animated active gradient line */}
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-purple-500 to-fuchsia-500 rounded-full"
          />
        </div>

        {/* Individual Steps */}
        <div className="flex flex-col gap-24">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-stretch ${
                  isEven ? '' : 'md:flex-row-reverse'
                }`}
              >
                {/* 1. Step Content block */}
                <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 backdrop-blur-md relative"
                  >
                    {/* Glowing side anchor glow */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${step.colorClass} rounded-l-2xl`} />

                    <span className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-1 block">
                      STEP {step.num}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
                </div>

                {/* Central Circle badge alignment */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-full bg-[#030014] border-2 border-slate-800 flex items-center justify-center shadow-lg relative group"
                  >
                    {/* Circle hover border highlight */}
                    <span className={`absolute -inset-0.5 rounded-full bg-gradient-to-r ${step.colorClass} opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-300 -z-10`} />
                    <span className="text-sm font-extrabold text-white">{step.num}</span>
                  </motion.div>
                </div>

                {/* 2. Empty Space helper / mini visualization placeholder for desktop */}
                <div className="hidden md:block w-1/2 px-12" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
