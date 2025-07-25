import React, { useEffect, useState } from "react";
import {
  X, ThumbsUp, Share2
} from "lucide-react";
import moment from "moment";
import {
  getVideoById,
  getVideoComments,
  addComment,
  toggleVideoLike,
  toggleCommentLike
} from "../Index/api";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoPlayerModal({ video, onClose }) {
  const [fullVideo, setFullVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (video?._id) {
      fetchVideoDetails();
      fetchComments();
    }
  }, [video?._id]);

  const fetchVideoDetails = async () => {
    try {
      const res = await getVideoById(video._id);
      setFullVideo(res.data);
      setIsLiked(res.data?.isLiked);
      setLikeCount(res.data?.totalLikes || 0);
    } catch (e) {
      console.error("Failed to fetch video:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getVideoComments({ videoId: video._id });
      setComments(res?.data?.comments || []);
    } catch (e) {
      console.error("Failed to fetch comments:", e.message);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      setIsPostingComment(true);
      await addComment(video._id, newComment);
      setNewComment("");
      await fetchComments();
    } catch (e) {
      console.error("Posting comment failed:", e.message);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleLikeToggle = async () => {
    try {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => isLiked ? prev - 1 : prev + 1);
      await toggleVideoLike(video._id);
    } catch (e) {
      console.error("Like toggle failed:", e.message);
    }
  };

  const handleCommentLike = async (id, index) => {
    try {
      const updated = [...comments];
      const liked = updated[index].isLiked;
      updated[index].isLiked = !liked;
      updated[index].totalLikes += liked ? -1 : 1;
      setComments(updated);
      await toggleCommentLike(id);
    } catch (e) {
      console.error("Comment like failed:", e.message);
    }
  };


  useEffect(() => {
  console.log("Opening modal for video:", video);
}, [video]);

  const duration = fullVideo?.duration || 0;
  const durationText = duration >= 60
    ? `${Math.floor(duration / 60)}m ${duration % 60}s`
    : `${duration}s`;

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center px-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="relative w-full max-w-7xl h-[90vh] bg-zinc-900 text-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full z-50"
            >
              <X size={20} />
            </button>

            {/* Left Section - Video + Details */}
            <div className="w-full md:w-2/3 h-1/2 md:h-full flex flex-col">
              {/* Video */}
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  Loading video...
                </div>
              ) : fullVideo?.videoFile ? (
                <video
                  src={fullVideo.videoFile}
                  controls
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-red-500">
                  ⚠️ Video source missing
                </div>
              )}

              {/* Metadata */}
              <div className="p-4 space-y-2 border-t border-zinc-800">
                <h2 className="text-xl font-bold">{fullVideo?.title}</h2>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={fullVideo?.owner?.avatar || "/default-avatar.png"}
                    className="w-10 h-10 rounded-full border"
                    alt="User avatar"
                  />
                  <div>
                    <p className="text-base font-semibold">
                      {fullVideo?.owner?.fullName || "Anonymous"}
                    </p>
                    <p className="text-sm text-zinc-400">
                      @{fullVideo?.owner?.userName || "user"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-300">{fullVideo?.description}</p>
                <p className="text-xs text-zinc-500">
                  Duration: {durationText} | Views: {fullVideo?.views || 0}
                </p>

                {/* Actions */}
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={handleLikeToggle}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                      isLiked ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    <ThumbsUp size={18} /> {likeCount}
                  </button>

                  <button className="px-4 py-2 rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600 flex items-center gap-2 transition-all duration-200 hover:scale-105">
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section - Comments */}
            <div className="w-full md:w-1/3 bg-zinc-950 border-l border-zinc-800 p-4 flex flex-col">
              {/* Add Comment */}
              <textarea
                rows={2}
                placeholder="Add a comment..."
                className="w-full p-2 rounded bg-zinc-800 text-sm resize-none placeholder:text-zinc-500"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
              />
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim() || isPostingComment}
                className="mt-2 w-full py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium disabled:bg-zinc-700"
              >
                {isPostingComment ? "Posting..." : "Post"}
              </button>

              {/* Comments */}
              <div className="mt-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-blue-700 hover:scrollbar-thumb-blue-600 scrollbar-track-transparent">
                {comments.length === 0 ? (
                  <p className="text-sm text-zinc-500">No comments yet.</p>
                ) : (
                  comments.map((c, i) => (
                    <div
                      key={c._id}
                      className="p-3 rounded-lg bg-zinc-800 mb-3 hover:bg-zinc-700 transition"
                    >
                      <div className="flex items-start gap-3 mb-1">
                        <img
                          src={c.user?.avatar || "/default-avatar.png"}
                          className="w-8 h-8 rounded-full border"
                          alt="User"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            @{c.user?.userName}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {moment(c.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mt-1 text-zinc-300">{c.content}</p>
                      <button
                        onClick={() => handleCommentLike(c._id, i)}
                        className={`mt-2 text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-200 hover:scale-105 ${
                          c.isLiked
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700 text-zinc-300"
                        }`}
                      >
                        <ThumbsUp size={14} />
                        {c.totalLikes}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
