import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getChannelVideos,
  getUserTweets,
  deleteVideo,
  deleteTweet,
  toggleTweetLike,
} from "../Index/api";
import EditableVideoCard from "../components/EditableVideoCard";
import EditableTweetCard from "../components/EditableTweetCard";
import VideoPlayerModal from "../components/VideoPlayerModal";
import {
  setCurrentVideo,
  setHasEnded,
  togglePlay,
  setIsBuffering,
} from "../utils/videoSlice";

export default function MyUploads() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.currentUser);
  const currentVideo = useSelector((state) => state.video.currentVideo);

  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  const fetchUploads = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const [videoRes, tweetRes] = await Promise.all([
        getChannelVideos(user._id),
        getUserTweets(user._id),
      ]);
      setVideos((videoRes?.data?.videos || []).filter(Boolean));
      setTweets((tweetRes?.data?.tweets || []).filter(Boolean));
    } catch (error) {
      console.error("❌ Error fetching uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, [user]);

  const handleDeleteVideo = async (id) => {
    try {
      await deleteVideo(id);
      fetchUploads();
    } catch (err) {
      console.error("❌ Failed to delete video:", err);
    }
  };

  const handleDeleteTweet = async (id) => {
    try {
      await deleteTweet(id);
      fetchUploads();
    } catch (err) {
      console.error("❌ Failed to delete tweet:", err);
    }
  };

  const handleToggleTweetLike = async (id) => {
    try {
      const updated = await toggleTweetLike(id);
      const updatedTweet = updated?.data?.tweet;

      if (!updatedTweet) {
        console.warn("No updated tweet returned from API");
        return;
      }

      setTweets((prev) =>
        prev.map((t) => (t._id === id ? updatedTweet : t))
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleVideoClick = (video) => {
    dispatch(setCurrentVideo(video));
    dispatch(setHasEnded(false));
    dispatch(togglePlay()); // Start playing
    dispatch(setIsBuffering(true)); // Assume buffering starts
  };

  const SkeletonCard = () => (
    <div className="h-[180px] bg-zinc-800 rounded-lg animate-pulse" />
  );

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      );
    }

    if (activeTab === "videos") {
      return videos.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) =>
            video?._id ? (
              <EditableVideoCard
                key={video._id}
                video={video}
                onClick={() => handleVideoClick(video)}
                onDelete={handleDeleteVideo}
                onRefresh={fetchUploads}
                editable={true}
              />
            ) : null
          )}
        </div>
      ) : (
        <p className="text-zinc-400 text-center">No videos uploaded.</p>
      );
    }

    if (activeTab === "tweets") {
      return tweets.length ? (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <EditableTweetCard
              key={tweet._id}
              tweet={tweet}
              onDelete={handleDeleteTweet}
              onRefresh={fetchUploads}
              isEditable={true}
              onToggleLike={handleToggleTweetLike}
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-400 text-center">No tweets posted.</p>
      );
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Uploads</h2>
        <button
          onClick={fetchUploads}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm text-white"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-zinc-700">
        {["videos", "tweets"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === tab
                ? "text-white border-b-2 border-red-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab === "videos" ? "Videos" : "Tweets"}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderTabContent()}

      {/* Video Modal */}
      {currentVideo && (
        <VideoPlayerModal
          video={currentVideo}
          onClose={() => dispatch(setCurrentVideo(null))}
        />
      )}
    </div>
  );
}
