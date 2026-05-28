'use client';

import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="w-full flex flex-col gap-6 select-none animate-pulse">
      {/* Welcome Card Skeleton */}
      <Skeleton className="w-full h-36" />

      {/* Metrics Row Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>

      {/* Grid of Main Content Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Analytics Graph */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Skeleton className="w-full h-72" />
          <Skeleton className="w-full h-64" />
        </div>

        {/* Right Side: Leaderboard Preview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Skeleton className="w-full h-96" />
          <Skeleton className="w-full h-40" />
        </div>
      </div>
    </div>
  );
}
