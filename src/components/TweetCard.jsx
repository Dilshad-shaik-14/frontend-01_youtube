import React, { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function TweetCard({ tweet }) {
  const [expanded, setExpanded] = useState(false);

  if (!tweet) return null;

  const {
    content = "",
    owner = {},
    createdAt,
    totalLikes = 0,
    isLiked = false,
  } = tweet;

  const displayText =
    expanded || content.length <= 200 ? content : `${content.slice(0, 200)}...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto rounded-xl shadow bg-zinc-900 p-4 mb-4 border border-zinc-800 relative hover:shadow-lg transition"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={owner.avatar || "/default-avatar.png"}
          alt={owner.userName || "User"}
          className="w-10 h-10 rounded-full object-cover border border-zinc-700"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-white text-sm font-medium">
            <span>{owner.fullName || "Unknown User"}</span>
            <span className="text-zinc-400">@{owner.userName || "anonymous"}</span>
            <span className="text-zinc-500 text-xs">
              · {dayjs(createdAt).fromNow()}
            </span>
          </div>
          {/* Content */}
          <div
            className="text-sm text-zinc-200 mt-1 whitespace-pre-wrap leading-relaxed cursor-pointer break-words"
            onClick={() => setExpanded(!expanded)}
          >
            {displayText}
            {content.length > 200 && !expanded && (
              <span className="text-blue-600 hover:underline ml-1">
                Read more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Likes Display */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
        <Heart size={16} className={`transition ${isLiked ? "text-pink-500" : ""}`} />
        <span>{totalLikes}</span>
      </div>
    </motion.div>
  );
}
