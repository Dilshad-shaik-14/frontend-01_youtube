import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X, Check, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { updateTweet, deleteTweet, toggleTweetLike } from "../Index/api";

dayjs.extend(relativeTime);

export default function EditableTweetCard({ tweet, onRefresh, editable = false }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(tweet.content || "");
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [likeCount, setLikeCount] = useState(tweet.likesCount || tweet.likes?.length || 0);
  const [liked, setLiked] = useState(tweet.isLikedByCurrentUser || false);

  useEffect(() => {
    setLiked(tweet.isLikedByCurrentUser ?? false);
    setLikeCount(tweet.likesCount ?? tweet.likes?.length ?? 0);
  }, [tweet]);

  const handleUpdate = async () => {
    setUpdating(true);
    await updateTweet(tweet._id, { content: editText });
    setUpdating(false);
    setEditing(false);
    setShowSuccess(true);
    onRefresh?.();
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleDelete = async () => {
    await deleteTweet(tweet._id);
    setShowConfirm(false);
    onRefresh?.();
  };

  const handleLikeToggle = async () => {
    try {
      setLiked((prev) => !prev);
      setLikeCount((prev) => liked ? prev - 1 : prev + 1);
      const res = await toggleTweetLike(tweet._id);
      const updated = res?.data?.tweet;
      if (updated?.likes) {
        setLiked(updated.isLikedByCurrentUser ?? updated.likes.includes(tweet.owner._id));
        setLikeCount(updated.likes.length);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setLiked((prev) => !prev);
      setLikeCount((prev) => liked ? prev + 1 : prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group rounded-2xl shadow-lg bg-base-100 border border-base-200 p-4 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={tweet.owner.avatar || "/default-avatar.png"}
            alt={tweet.owner.userName || "User"}
            className="w-10 h-10 rounded-full object-cover border border-base-200"
          />
          <div>
            <div className="font-semibold text-sm text-base-content">
              {tweet.owner.fullName || "Unknown User"}
            </div>
            <div className="text-xs text-zinc-500 block">
              @{tweet.owner.userName} · {dayjs(tweet.createdAt).fromNow()}
            </div>
          </div>
        </div>

        {/* Edit/Delete Controls (hover) */}
        {editable && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="bg-base-200/70 p-1.5 rounded hover:text-blue-500 shadow"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-base-200/70 p-1.5 rounded hover:text-red-500 shadow"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-sm text-base-content whitespace-pre-wrap leading-relaxed mb-3">
        {tweet.content}
      </div>

      {/* Likes */}
      <div className="text-xs text-zinc-500 mt-2 relative">
        <span className="block mb-1 text-base-content">
          ❤️ {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </span>
        <button
          onClick={handleLikeToggle}
          className="absolute top-0 right-0 bg-base-200/50 p-2 rounded-full hover:bg-base-200 transition"
          title="Toggle Like"
        >
          <Heart
            size={16}
            className={`${liked ? "text-pink-500" : "text-zinc-400 hover:text-pink-400"}`}
            fill={liked ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            <Check size={16} /> Saved
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-base-100 border border-base-200 p-6 rounded-2xl max-w-md w-full shadow-xl"
            >
              <button
                onClick={() => setEditing(false)}
                className="absolute top-3 right-3 text-zinc-500 hover:text-red-500"
              >
                <X size={20} />
              </button>

              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows="5"
                className="w-full mb-4 p-2 rounded-md border border-base-200 text-base-content bg-base-100"
                placeholder="What's happening?"
              />

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-base-100 border border-base-200 p-6 rounded-2xl w-full max-w-sm text-center shadow-lg"
            >
              <h2 className="text-lg font-semibold text-base-content mb-4">
                Confirm Delete
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                Are you sure you want to delete this tweet?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-1 rounded-md border border-base-200 text-base-content"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
