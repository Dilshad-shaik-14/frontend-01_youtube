import React, { useEffect, useState } from "react";
import {
  getLikedVideos,
  getLikedTweets,
  getLikedComments,
  toggleVideoLike,
  toggleTweetLike,
  toggleCommentLike,
} from "../../Index/api";
import LikeCard from "../../components/LikeCard";
import VideoPlayerModal from "../../components/VideoPlayerModal";

function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-zinc-900 text-white rounded-lg shadow-lg w-96 p-6 space-y-4">
        <h3 className="text-lg font-semibold">Confirm Action</h3>
        <p className="text-sm text-zinc-300">{message}</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-sm font-semibold"
          >
            Yes, Unlike
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Liked() {
  const [tab, setTab] = useState("videos");
  const [likedVideos, setLikedVideos] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [likedComments, setLikedComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [unlikeTarget, setUnlikeTarget] = useState({ id: null, type: "" });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const fetchLikedContent = async () => {
    setLoading(true);
    try {
      const [videoRes, tweetRes, commentRes] = await Promise.all([
        getLikedVideos(),
        getLikedTweets(),
        getLikedComments(),
      ]);
      setLikedVideos(videoRes?.data?.videos || []);
      setLikedTweets(tweetRes?.data?.tweets || []);
      setLikedComments(commentRes?.data?.comments || []);
    } catch (err) {
      console.error("❌ Error fetching liked content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedContent();
  }, []);

  const requestUnlike = (id, type) => {
    setUnlikeTarget({ id, type });
    setShowConfirm(true);
  };

  const handleConfirmUnlike = async () => {
    const { id, type } = unlikeTarget;
    try {
      if (type === "video") {
        await toggleVideoLike(id);
        setLikedVideos((prev) => prev.filter((v) => v._id !== id));
      } else if (type === "tweet") {
        await toggleTweetLike(id);
        setLikedTweets((prev) => prev.filter((t) => t._id !== id));
      } else if (type === "comment") {
        await toggleCommentLike(id);
        setLikedComments((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(`❌ Failed to unlike ${type}:`, err);
    } finally {
      setShowConfirm(false);
      setUnlikeTarget({ id: null, type: "" });
    }
  };

  const renderContent = () => {
    const data =
      tab === "videos"
        ? likedVideos
        : tab === "tweets"
        ? likedTweets
        : likedComments;

    if (loading) return <p className="text-zinc-400">Loading...</p>;
    if (data.length === 0)
      return <p className="text-zinc-500">No liked {tab}.</p>;

    return (
      <div
        className={
          tab === "videos"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {data.map((item) => (
        <LikeCard
        key={item._id}
        item={item}
        type={tab}
        onUnlike={(id) => requestUnlike(id, tab.slice(0, -1))}
        onPlayVideo={() => {
          if (tab === "videos") {
            setSelectedVideo(item);
            setIsVideoModalOpen(true);
            }
          }}
        />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white border-b-4 border-red-500 pb-2 w-fit">
          Liked Content
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["videos", "tweets", "comments"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded font-medium transition ${
              tab === t
                ? "bg-red-500 text-white"
                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            }`}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {renderContent()}

      <ConfirmModal
        isOpen={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmUnlike}
        message={`Are you sure you want to unlike this ${unlikeTarget.type}?`}
      />

      <VideoPlayerModal
      video={selectedVideo}
      onClose={() => {
      setIsVideoModalOpen(false);
      setSelectedVideo(null); // ✅ This clears the modal
  }}
/>

    </div>
  );
}
