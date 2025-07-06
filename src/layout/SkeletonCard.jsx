// layout/SkeletonCard.jsx
export const SkeletonCard = () => (
  <div className="animate-pulse p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
    <div className="w-10 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-full mb-2"></div>
    <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4 mb-1"></div>
    <div className="h-2 bg-zinc-200 dark:bg-zinc-600 rounded w-1/2"></div>
  </div>
);

export const SkeletonVideoCard = () => (
  <div className="animate-pulse p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 space-y-3">
    <div className="w-full h-40 bg-zinc-300 dark:bg-zinc-700 rounded"></div>
    <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-2/3"></div>
    <div className="h-2 bg-zinc-200 dark:bg-zinc-600 rounded w-1/3"></div>
  </div>
);

export const SkeletonTweetCard = () => (
  <div className="animate-pulse p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 space-y-2">
    <div className="flex gap-3 items-center">
      <div className="w-10 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
      <div className="flex-1 space-y-1">
        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-2/5"></div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-600 rounded w-1/4"></div>
      </div>
    </div>
    <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-full"></div>
    <div className="h-2 bg-zinc-200 dark:bg-zinc-600 rounded w-5/6"></div>
  </div>
);
