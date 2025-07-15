import React, { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { updateTweet, deleteTweet } from "../Index/api";

dayjs.extend(relativeTime);

export default function EditableTweetCard({ tweet, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(tweet.content || "");
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group rounded-xl shadow bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={tweet.owner.avatar || "/default-avatar.png"}
            alt={tweet.owner.userName || "User"}
            className="w-10 h-10 rounded-full object-cover border border-zinc-700"
          />
          <div>
            <div className="font-semibold text-sm text-zinc-800 dark:text-white">
              {tweet.owner.fullName || "Unknown User"}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              @{tweet.owner.userName} · {dayjs(tweet.createdAt).fromNow()}
            </div>
          </div>
        </div>

        <div className="hidden group-hover:flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="bg-white/80 dark:bg-zinc-800/80 p-1.5 rounded hover:text-blue-500 shadow"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-white/80 dark:bg-zinc-800/80 p-1.5 rounded hover:text-red-500 shadow"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="text-sm text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
        {tweet.content}
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
              className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 p-6 rounded-xl max-w-md w-full relative shadow-xl"
            >
              <button
                onClick={() => setEditing(false)}
                className="absolute top-3 right-3 text-zinc-400 hover:text-red-500"
              >
                <X size={20} />
              </button>

              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows="5"
                className="w-full mb-4 p-2 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-white"
                placeholder="What's happening?"
              />

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 p-6 rounded-xl w-full max-w-sm text-center"
            >
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">
                Confirm Delete
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Are you sure you want to delete this tweet?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-1 rounded border dark:border-zinc-600 text-zinc-600 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
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
