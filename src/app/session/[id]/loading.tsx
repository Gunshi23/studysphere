'use client';

import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

export default function SessionLoading() {
  return (
    <div className="w-full flex flex-col gap-8 select-none animate-pulse">
      {/* Header bar skeleton */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-5" />
            <Skeleton className="w-48 h-3.5" />
          </div>
        </div>
        <Skeleton className="w-48 h-8" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Clock Dial Card */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <Skeleton className="w-full h-[360px]" />
        </div>

        {/* Right Side: Checklist and Notepad */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[220px]" />
        </div>
      </div>
    </div>
  );
}
