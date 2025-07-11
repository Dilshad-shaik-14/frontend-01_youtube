import React, { useState } from "react";
import { Heart, Pencil, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { updateTweet, toggleTweetLike } from "../Index/api";

dayjs.extend(relativeTime);

export default function TweetCard({ tweet, onDelete, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(tweet?.text || "");
  const [updating, setUpdating] = useState(false);
  const [likesCount, setLikesCount] = useState(tweet?.likesCount || 0);
  const [liked, setLiked] = useState(tweet?.isLiked || false);
  const [likeLoading, setLikeLoading] = useState(false);

  if (!tweet) return null;

  const {
    _id,
    text = "",
    owner = {},
    createdAt,
  } = tweet;

  const displayText =
    expanded || text.length <= 200 ? text : `${text.slice(0, 200)}...`;

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await updateTweet(_id, { text: editText });
      onRefresh?.();
      setEditing(false);
    } catch (err) {
      console.error("Tweet update failed", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      await toggleTweetLike(_id);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl shadow bg-zinc-900 p-4 mb-4 border border-zinc-800 relative hover:shadow-lg transition"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <img
              src={owner.avatar || "/default-avatar.png"}
              alt={owner.userName || "User"}
              className="w-10 h-10 rounded-full mr-3 object-cover border border-zinc-700"
            />
            <div>
              <div className="font-semibold text-sm text-white">
                {owner.fullName || "Unknown User"}
              </div>
              <div className="text-xs text-zinc-400">
                @{owner.userName || "anonymous"} · {dayjs(createdAt).fromNow()}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-blue-400 hover:text-blue-500"
              title="Edit Tweet"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete?.(_id)}
              className="text-red-400 hover:text-red-500"
              title="Delete Tweet"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="text-sm text-zinc-200 mb-3 whitespace-pre-wrap leading-relaxed cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {displayText}
          {text.length > 200 && !expanded && (
            <span className="text-blue-600 hover:underline ml-1">Read more</span>
          )}
        </div>

        {/* Like Section */}
        <div className="flex gap-6 text-xs text-zinc-400 mt-2">
          <button
            className={`flex items-center gap-1 hover:text-pink-500 transition ${
              liked ? "text-pink-500" : ""
            }`}
            onClick={handleLike}
            disabled={likeLoading}
            title="Like Tweet"
          >
            <Heart size={16} /> {likesCount}
          </button>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 relative shadow-lg">
            <button
              onClick={() => setEditing(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-red-500"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-semibold text-red-500 mb-4">Edit Tweet</h3>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows="5"
              className="w-full mb-4 p-2 rounded bg-zinc-800 text-white border border-zinc-600"
              placeholder="What's happening?"
            />

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded w-full"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
