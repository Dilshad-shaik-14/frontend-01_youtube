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
    dispatch(togglePlay());
    dispatch(setIsBuffering(true));
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
        <div className="flex flex-wrap justify-center gap-6">
          {tweets.map((tweet) =>
            tweet?._id ? (
              <div key={tweet._id} className="w-full sm:w-[48%] lg:w-[32%]">
                <EditableTweetCard
                  tweet={tweet}
                  onDelete={handleDeleteTweet}
                  onRefresh={fetchUploads}
                  isEditable={true}
                  onToggleLike={handleToggleTweetLike}
                />
              </div>
            ) : null
          )}
        </div>
      ) : (
        <p className="text-zinc-400 text-center">No tweets posted.</p>
      );
    }
  };

  return (
    <div className="flex flex-1 min-h-screen bg-[#0f0f0f] text-white">
      <main className="flex-1 px-6 sm:px-8 lg:px-10 py-8 overflow-auto max-w-[1600px] w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white border-b-4 border-red-500 pb-3 w-fit">
            My Uploads
          </h2>
          <button
            onClick={fetchUploads}
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm text-white"
          >
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {["videos", "tweets"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded font-medium transition ${
                activeTab === t
                  ? "bg-red-500 text-white"
                  : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)}
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
      </main>
    </div>
  );
}
