'use client';

import React from 'react';
import { MessageSquare, Shield } from 'lucide-react';

export default function Footer() {
  const socialIcons = [
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
      href: '#',
      name: 'Twitter',
      colorClass: 'hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.4)]',
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
      href: '#',
      name: 'GitHub',
      colorClass: 'hover:text-slate-100 hover:shadow-[0_0_10px_rgba(255,255,255,0.4)]',
    },
    {
      icon: <MessageSquare size={16} />,
      href: '#',
      name: 'Discord',
      colorClass: 'hover:text-indigo-400 hover:shadow-[0_0_10px_rgba(129,140,248,0.4)]',
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <polygon points="10 15 15 12 10 9" fill="currentColor" />
        </svg>
      ),
      href: '#',
      name: 'YouTube',
      colorClass: 'hover:text-red-400 hover:shadow-[0_0_10px_rgba(248,113,113,0.4)]',
    },
  ];

  const links = [
    {
      title: 'Platform',
      items: [
        { name: 'Study Rooms', href: '#' },
        { name: 'Pomodoro Timer', href: '#' },
        { name: 'Analytics Board', href: '#' },
        { name: 'Leaderboards', href: '#' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { name: 'Documentation', href: '#' },
        { name: 'Community Guide', href: '#' },
        { name: 'Support FAQ', href: '#' },
        { name: 'System Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      items: [
        { name: 'About Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
      ],
    },
  ];

  return (
    <footer className="relative w-full bg-[#030014] z-10 pt-20 pb-10 px-6 select-none border-t border-white/5">
      
      {/* Upper Border Gradient Line divider */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-studysphere-purple/30 to-transparent" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
        
        {/* Logo & Slogan Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-studysphere-purple to-studysphere-blue flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] font-display">
              S
            </div>
            <span className="font-extrabold text-lg text-white tracking-wider font-display">StudySphere</span>
          </div>
          <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm">
            Collaborative virtual study rooms built for students, builders, and learners. Keep your flow state active, find partners, and stay consistent.
          </p>
          
          {/* Social Links Row */}
          <div className="flex gap-3.5 mt-2">
            {socialIcons.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                className={`p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 transition-all duration-300 ${social.colorClass} flex items-center justify-center`}
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links Navigation Columns */}
        {links.map((col, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{col.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {col.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <a
                    href={item.href}
                    className="text-xs text-slate-400 hover:text-white transition-colors duration-300 font-light"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer bottom details */}
      <div className="max-w-7xl mx-auto w-full border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-slate-500 font-light">
          &copy; {new Date().getFullYear()} StudySphere Inc. All rights reserved. Designed for maximum focus.
        </p>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-light">
          <Shield size={12} className="text-cyan-500" /> End-to-end encrypted study sessions.
        </div>
      </div>
    </footer>
  );
}
