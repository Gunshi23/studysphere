'use client';

import React from 'react';

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function GlowingButton({
  variant = 'primary',
  children,
  className = '',
  ...props
}: GlowingButtonProps) {
  return (
    <button
      className={`relative px-8 py-3.5 rounded-xl font-medium tracking-wide overflow-hidden transition-all duration-300 group hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-studysphere-purple to-studysphere-blue text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]'
          : 'bg-studysphere-dark border border-white/10 text-slate-200 hover:text-white hover:border-studysphere-purple/40 hover:bg-white/[0.02]'
      } ${className}`}
      {...props}
    >
      {/* Light glow reflection effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Background glow backing */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-studysphere-fuchsia via-studysphere-purple to-studysphere-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
      )}

      {/* Button content */}
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
