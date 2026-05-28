'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Card from '../UI/Card';
import { Users, Clock, MonitorPlay, Zap } from 'lucide-react';

interface StatCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function StatCounter({ end, suffix = '', duration = 1.5 }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    
    let frame = 0;
    const totalFrames = Math.round(duration * 60);
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad
      const current = Math.round(end * (progress * (2 - progress)));
      setCount(current);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [isInView, end, duration]);

  return <span ref={ref} className="font-mono">{count.toLocaleString()}{suffix}</span>;
}

export default function TrustStats() {
  const stats = [
    {
      label: 'Students Online Now',
      end: 18450,
      suffix: '+',
      icon: <Users className="text-cyan-400" size={24} />,
      color: 'blue' as const,
      desc: 'Active learners currently study-chatting',
    },
    {
      label: 'Focus Hours Logged',
      end: 842500,
      suffix: 'h',
      icon: <Clock className="text-purple-400" size={24} />,
      color: 'purple' as const,
      desc: 'Total logged Pomodoro focus duration',
    },
    {
      label: 'Active Study Rooms',
      end: 1250,
      suffix: '+',
      icon: <MonitorPlay className="text-fuchsia-400" size={24} />,
      color: 'fuchsia' as const,
      desc: 'Collaborative rooms active right now',
    },
    {
      label: 'Focus Milestones Met',
      end: 42,
      suffix: 'M+',
      icon: <Zap className="text-yellow-400" size={24} />,
      color: 'purple' as const,
      desc: 'Quests and study achievements completed',
    },
  ];

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto w-full select-none z-10">
      
      {/* Background Section glow backing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-[150px] bg-studysphere-purple/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Grid of stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
          >
            <Card glowColor={stat.color} className="h-full flex flex-col justify-between p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  {stat.label}
                </span>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 shadow-inner">
                  {stat.icon}
                </div>
              </div>
              
              <div className="mt-2">
                <div className="text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  <StatCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-slate-400 mt-2 font-light leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
