import React from "react";
import { Heart, PlayCircle } from "lucide-react";

const LikeCard = ({ item, type, onUnlike, onPlayVideo }) => {
  if (!item) return null;

  const {
    _id,
    content,
    title,
    thumbnail,
    createdAt,
    owner = {},
    totalLikes = 0,
  } = item;

  const safeAvatar = owner.avatar || "/default-avatar.png";
  const safeUserName = owner.userName || "anonymous";
  const safeFullName = owner.fullName || "Unknown User";

  const preview =
    type === "videos"
      ? title || "Untitled video"
      : content?.length > 100
      ? content.slice(0, 100) + "..."
      : content;

  return (
    <div className="card bg-base-100 border border-base-300 dark:bg-base-300 dark:border-base-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      {/* User Info */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={safeAvatar}
          alt={safeUserName}
          className="w-10 h-10 rounded-full object-cover border border-base-300 dark:border-base-700"
        />
        <div className="flex-1 min-w-0">
          {/* Heading: Theme-aware contrast */}
          <p className="text-base-content text-sm font-semibold truncate">
            {safeFullName}
          </p>
          {/* Subtext */}
          <p className="text-base-content/70 text-xs truncate">
            @{safeUserName}
          </p>
          <p className="text-base-content/50 text-xs truncate">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <button
          className="p-2 rounded-full hover:bg-base-200 dark:hover:bg-base-700 transition"
          onClick={() => onUnlike(_id)}
          title={`Unlike ${type}`}
        >
          <Heart size={16} className="text-pink-500" />
        </button>
      </div>

      {/* Main Content */}
      {type === "videos" && (
        <div className="relative cursor-pointer group" onClick={onPlayVideo}>
          <img
            src={thumbnail || "/default-thumbnail.jpg"}
            alt={title}
            className="w-full h-48 object-cover rounded-b-xl transition duration-200 group-hover:brightness-75"
          />
          <PlayCircle
            size={40}
            className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition duration-200"
          />
          <div className="p-3">
            <p className="text-base-content text-sm font-medium">{title}</p>
          </div>
        </div>
      )}

      {type !== "videos" && (
        <div className="p-4">
          <p className="text-base-content text-sm whitespace-pre-wrap">
            {preview}
          </p>
        </div>
      )}

      {/* Likes */}
      <div className="px-4 py-2 text-xs text-base-content/70">
        ❤️ {totalLikes} {totalLikes === 1 ? "Like" : "Likes"}
      </div>
    </div>
  );
};

export default LikeCard;
