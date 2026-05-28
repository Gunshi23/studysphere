'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Hero from '@/components/Sections/Hero';
import TrustStats from '@/components/Sections/TrustStats';
import Features from '@/components/Sections/Features';
import Showcase from '@/components/Sections/Showcase';
import HowItWorks from '@/components/Sections/HowItWorks';
import RoomPreview from '@/components/Sections/RoomPreview';
import Testimonials from '@/components/Sections/Testimonials';
import CTA from '@/components/Sections/CTA';
import Footer from '@/components/Sections/Footer';
import GlowingButton from '@/components/UI/GlowingButton';
import Link from 'next/link';

export default function Home() {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Handle header blur backdrop activation on scroll
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 50) {
      setIsNavScrolled(true);
    } else {
      setIsNavScrolled(false);
    }
  });

  return (
    <>
      {/* Floating Glassmorphic Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isNavScrolled
            ? 'py-4 bg-[#030014]/75 border-b border-white/5 backdrop-blur-md shadow-lg shadow-black/10'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-studysphere-purple to-studysphere-blue flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] font-display">
              S
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white font-display">
              StudySphere
            </span>
          </div>

          {/* Center Links (Desktop only) */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Home
            </a>
            <a href="#features" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#workspace" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
              3D Workspace
            </a>
            <a href="#preview" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Live Preview
            </a>
            <a href="#reviews" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
              Reviews
            </a>
          </nav>

          {/* Action button */}
          <div>
            <Link href="/login">
              <GlowingButton variant="secondary" className="px-5 py-2 text-xs">
                Enter App
              </GlowingButton>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main landing container */}
      <main className="flex-grow flex flex-col items-center">
        {/* 1. Hero Landing Cover */}
        <div id="home" className="w-full">
          <Hero />
        </div>

        {/* 2. Stat Counts */}
        <TrustStats />

        {/* 3. Platform Capabilities */}
        <div id="features" className="w-full">
          <Features />
        </div>

        {/* 4. 3D Workspace Scene */}
        <div id="workspace" className="w-full">
          <Showcase />
        </div>

        {/* 5. Timed workflow steps */}
        <HowItWorks />

        {/* 6. Dashboard Preview simulation */}
        <div id="preview" className="w-full">
          <RoomPreview />
        </div>

        {/* 7. Client feedback rows */}
        <div id="reviews" className="w-full">
          <Testimonials />
        </div>

        {/* 8. Call-To-Action Sign Up */}
        <CTA />
      </main>

      {/* 9. Site Footer */}
      <Footer />
    </>
  );
}
