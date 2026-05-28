'use client';

import React from 'react';

export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/[0.02] border border-white/5 rounded-xl shadow-inner relative overflow-hidden ${className}`}>
      {/* Light pulse scanning sweep overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}
