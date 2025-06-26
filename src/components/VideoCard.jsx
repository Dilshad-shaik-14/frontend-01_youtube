import React from "react";

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function VideoCard({ video, onClick }) {
  return (
    <div
      className="rounded-lg shadow-md bg-white dark:bg-zinc-900 cursor-pointer hover:shadow-lg transition p-3"
      onClick={() => onClick && onClick(video)}
    >
      {/* Thumbnail */}
      <div className="aspect-video w-full rounded-md overflow-hidden mb-2 bg-zinc-200 dark:bg-zinc-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-base mb-1 truncate">
        {video.title}
      </h3>

      {/* Channel Name */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
        {video.owner?.username || "Unknown Channel"}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-zinc-400">{video.views} views</span>
        <span className="text-xs text-zinc-400">
          {formatDuration(video.duration)}
        </span>
      </div>
    </div>
  );
}
