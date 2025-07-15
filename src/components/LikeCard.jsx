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
    <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700 relative hover:shadow-lg transition">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={safeAvatar}
          alt={safeUserName}
          className="w-8 h-8 rounded-full object-cover border border-zinc-600"
        />
        <div>
          <p className="text-sm font-semibold text-white">{safeFullName}</p>
          <p className="text-xs text-zinc-400">@{safeUserName}</p>
          <p className="text-xs text-zinc-500">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Content */}
      {type === "videos" && (
        <div className="mb-2 relative group cursor-pointer" onClick={onPlayVideo}>
          <img
            src={thumbnail || "/default-thumbnail.jpg"}
            alt={title}
            className="rounded-lg w-full h-auto max-h-48 object-cover mb-2 group-hover:brightness-75 transition duration-200"
          />
          <PlayCircle
            size={40}
            className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition duration-200"
          />
          <p className="text-sm font-medium text-white mt-1">{title}</p>
        </div>
      )}

      {type !== "videos" && (
        <p className="text-sm text-white whitespace-pre-wrap">{preview}</p>
      )}

      {/* Meta + Unlike */}
      <div className="text-xs text-zinc-500 mt-2">
        ❤️ {totalLikes} {totalLikes === 1 ? "Like" : "Likes"}
      </div>

      <button
        className="absolute top-2 right-2 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition"
        onClick={() => onUnlike(_id)}
        title={`Unlike ${type}`}
      >
        <Heart size={16} className="text-pink-500" />
      </button>
    </div>
  );
};

export default LikeCard;
