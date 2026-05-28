'use client';

import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

export default function RoomsLoading() {
  return (
    <div className="w-full flex flex-col gap-6 select-none animate-pulse">
      {/* Header Search & Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Skeleton className="w-full sm:w-1/3 h-10" />
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
        </div>
      </div>

      {/* Grid of Study Room cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-56" />
        ))}
      </div>
    </div>
  );
}
