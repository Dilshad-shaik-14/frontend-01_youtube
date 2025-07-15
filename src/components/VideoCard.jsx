import React from "react";
import { motion } from "framer-motion";

// Duration formatter (kept from your original)
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function VideoCard({ video, onClick }) {
  if (!video) return null;

  const { title, description, thumbnail, views, duration } = video;

  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden shadow-lg bg-zinc-900 border border-zinc-800 cursor-pointer transition-all w-full max-w-2xl mx-auto"
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick?.(video)}
    >
      {/* Thumbnail */}
      <div className="aspect-video relative w-full overflow-hidden">
        <img
          src={thumbnail || "/placeholder-thumbnail.png"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:opacity-100 opacity-0 transition duration-300" />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Info Section */}
      <div className="p-4 space-y-1">
        <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
        <p className="text-sm text-zinc-400 line-clamp-2 break-words">{description}</p>
        <div className="text-xs text-zinc-500">{views || 0} views</div>
      </div>
    </motion.div>
  );
}
