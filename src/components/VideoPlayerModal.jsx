import React, { useState, useEffect } from "react";
import { X, ThumbsUp, Share2, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { addComment, getVideoComments } from "../Index/api";

dayjs.extend(relativeTime);

export default function VideoPlayerModal({ video, onClose }) {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const user = useSelector((state) => state.auth?.user || state.user || null);

  // ✅ Fetch Comments
  useEffect(() => {
    if (video?._id) {
      getVideoComments({ videoId: video._id, page: 1, limit: 10 })
        .then((res) => setComments(res))
        .catch((err) => {
          console.error("❌ Error fetching comments:", err);
        });
    }
  }, [video]);

  // ✅ Submit new comment
  const handleCommentSubmit = async () => {
    if (!comment.trim() || !user) return;

    try {
      const newComment = await addComment(video._id, { text: comment });

      // Enrich comment with frontend user info
      const enriched = {
        ...newComment,
        user: {
          avatar: user.avatar || "/default-avatar.png",
          username: user.username || "anonymous",
        },
      };

      setComments((prev) => [...prev, enriched]);
      setComment("");
    } catch (err) {
      console.error("❌ Error adding comment:", err);
      alert("Something went wrong while adding your comment.");
    }
  };

  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl rounded-3xl bg-gradient-to-br from-[#0e0e0e] to-[#1c1c1c] border border-zinc-800 shadow-[0_0_50px_#00000080] overflow-hidden"
        >
          {/* ❌ Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full z-50"
          >
            <X size={20} />
          </button>

          {/* 🎥 Video Player */}
          <div className="bg-black rounded-t-3xl overflow-hidden">
            <video
              src={video.videoFile}
              autoPlay
              controls
              className="w-full h-[70vh] object-contain"
            />
          </div>

          {/* 📄 Video Content */}
          <div className="p-6 space-y-6 text-white bg-black/40 backdrop-blur-2xl">
            <div>
              <h2 className="text-3xl font-bold mb-1">{video.title}</h2>
              <p className="text-zinc-300 text-sm">{video.description}</p>
            </div>

            {/* ❤️ Actions */}
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all ${
                  liked ? "bg-blue-600 hover:bg-blue-700" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <ThumbsUp size={16} /> {liked ? "Liked" : "Like"}
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("🔗 Link copied!");
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm"
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* 💬 Comment Input */}
            {user ? (
              <div className="flex items-center gap-3">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Leave a comment..."
                  className="flex-1 px-4 py-2 rounded-full bg-white/10 text-white placeholder:text-zinc-400 border border-zinc-700 focus:outline-none"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full"
                >
                  <Send size={18} />
                </button>
              </div>
            ) : (
              <div className="text-zinc-400 text-sm">Login to add comments.</div>
            )}

            {/* 📜 Comments List */}
            <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
              {comments.length === 0 ? (
                <p className="text-sm text-zinc-400">No comments yet.</p>
              ) : (
                comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <img
                      src={c.user?.avatar || "/default-avatar.png"}
                      alt={c.user?.username || "user"}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-600"
                    />
                    <div
                      className={`bg-white/5 p-3 rounded-xl w-full ${
                        c.user?.username === user?.username ? "border border-blue-700" : ""
                      }`}
                    >
                      <div className="text-sm font-semibold text-white">
                        @{c.user?.username || "anonymous"}
                      </div>
                      <p className="text-sm text-zinc-300">{c.text}</p>
                      <div className="text-xs text-zinc-500 mt-1">
                        {dayjs(c.createdAt).fromNow()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
