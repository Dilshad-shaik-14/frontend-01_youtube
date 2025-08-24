// layout/SkeletonCard.jsx
import React from "react";

// 🔥 Shared shimmer style
const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

export const SkeletonCard = ({ className = "" }) => (
  <div
    className={`animate-pulse p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 shadow-sm flex flex-col gap-3 ${shimmer} ${className}`}
  >
    <div className="w-12 h-12 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
    <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4"></div>
    <div className="h-3 bg-zinc-200 dark:bg-zinc-600 rounded w-1/2"></div>
  </div>
);

export const SkeletonVideoCard = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800 shadow-md flex flex-col ${shimmer} ${className}`}
  >
    <div className="w-full h-40 bg-zinc-300 dark:bg-zinc-700 rounded-t-xl"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-2/3"></div>
      <div className="h-3 bg-zinc-200 dark:bg-zinc-600 rounded w-1/3"></div>
    </div>
  </div>
);

export const SkeletonTweetCard = ({ className = "" }) => (
  <div
    className={`animate-pulse p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 shadow-sm space-y-3 ${shimmer} ${className}`}
  >
    <div className="flex gap-3 items-center">
      <div className="w-10 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-2/5"></div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-600 rounded w-1/4"></div>
      </div>
    </div>
    <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-full"></div>
    <div className="h-2 bg-zinc-200 dark:bg-zinc-600 rounded w-5/6"></div>
  </div>
);

export const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-base-300 border-t-red-500"></div>
  </div>
);

