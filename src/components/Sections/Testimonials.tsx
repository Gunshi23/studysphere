'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import { Star, MessageSquare } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Aria Vance',
      role: 'CS Student, MIT',
      avatar: 'AV',
      quote: 'StudySphere completely saved my semesters. The community room Pomodoros keep me so accountable. I went from studying 10 hours a week to over 35!',
      color: 'purple' as const,
      rating: 5,
    },
    {
      name: 'Marcus K.',
      role: 'Pre-Med, Oxford University',
      avatar: 'MK',
      quote: 'Being able to co-study with students globally makes late-night exam prep actually fun. The UI is gorgeous, and the integrated focus analytics are incredibly insightful.',
      color: 'blue' as const,
      rating: 5,
    },
    {
      name: 'Liam Takahashi',
      role: 'Software Engineer, Tokyo',
      avatar: 'LT',
      quote: 'Our remote team spins up a private room every morning. The shared todo sync and keyboard tracking keeps the entire squad locked in and productive.',
      color: 'fuchsia' as const,
      rating: 5,
    },
    {
      name: 'Chloe Dupont',
      role: 'Graphic Designer, Paris',
      avatar: 'CD',
      quote: 'The dark aesthetic is so easy on the eyes. The interactive 3D desk element makes me look forward to opening the app every single day.',
      color: 'purple' as const,
      rating: 5,
    },
    {
      name: 'Dr. Jordan Wood',
      role: 'Researcher, Stanford',
      avatar: 'JW',
      quote: 'The data metrics are outstanding. The focus density charts helped me figure out my optimal studying cycles. Excellent execution of a developer-focused app.',
      color: 'blue' as const,
      rating: 5,
    },
  ];

  // Double the list to make infinite scrolling seamless
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative py-28 w-full z-10 overflow-hidden select-none">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studysphere-purple/10 border border-studysphere-purple/20 mb-4"
        >
          <span className="text-[10px] tracking-widest text-studysphere-purple font-bold uppercase">REVIEWS</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-6"
        >
          Loved by Students Worldwide
        </motion.h2>
      </div>

      {/* Marquee Row Container */}
      <div className="relative w-full flex items-center justify-start py-8">
        
        {/* Left & Right shade overlay gradients to hide edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#030014] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#030014] to-transparent z-20 pointer-events-none" />

        {/* Scrolling row */}
        <div className="animate-marquee gap-8 pr-8 flex">
          {duplicatedTestimonials.map((t, idx) => (
            <div key={idx} className="w-[300px] md:w-[380px] flex-shrink-0">
              <Card glowColor={t.color} className="h-full flex flex-col justify-between p-6">
                <div>
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  
                  {/* Message Quote */}
                  <p className="text-sm md:text-base text-slate-300 font-light italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* User card info */}
                <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-slate-400 font-light mt-0.5">{t.role}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
