import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  getUserChannelProfile,
  getWatchHistory,
  deleteHistory,
  getChannelStats,
  getChannelVideos,
} from "../Index/api";
import VideoPlayerModal from "../components/VideoPlayerModal"; 

const UserDashboard = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const userName = currentUser?.userName || "";
  const channelId = currentUser?._id;

  const [channel, setChannel] = useState(null);
  const [channelStats, setChannelStats] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userName || !channelId) {
        toast.error("User not logged in or username/channel ID missing");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [channelRes, statsRes, videosRes, historyRes] = await Promise.all([
          getUserChannelProfile(userName),
          getChannelStats(channelId),
          getChannelVideos(channelId),
          getWatchHistory(),
        ]);

        setChannel(channelRes.data);
        setChannelStats(statsRes.data);
        setChannelVideos(videosRes.data.videos);
        setWatchHistory(historyRes.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || err.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userName, channelId]);

  const handleDeleteHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your entire watch history? This action cannot be undone."
      )
    )
      return;

    try {
      setDeleting(true);
      await deleteHistory();
      setWatchHistory([]);
      toast.success("Watch history deleted successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete history"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200 dark:bg-base-300 text-base-content text-xl font-semibold select-none">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 dark:bg-base-300 text-base-content px-10 py-14 max-w-[1440px] mx-auto space-y-12">
      {/* Channel Profile */}
      {channel && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 dark:bg-base-200 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Cover Banner */}
          <div
            className="w-full h-40 sm:h-44 bg-cover bg-center border-b-4 border-error transition duration-300"
            style={{
              backgroundImage: `url(${
                channel.coverImage || "/default-cover.jpg"
              })`,
            }}
            aria-label="Channel Cover Image"
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start px-10 py-5 gap-6">
            <motion.img
              src={channel.avatar || "/default-avatar.png"}
              alt={`${channel.fullName} avatar`}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-error shadow"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
            />

            <div className="flex-1 select-text">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">
                {channel.fullName}
              </h1>
              <p className="text-md sm:text-lg text-gray-500 font-semibold mt-1">
                @{channel.userName}
              </p>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                {channel.email}
              </p>

              <div className="mt-5 flex flex-wrap gap-6 font-semibold text-lg">
                <StatCard
                  label="Subscribers"
                  value={channel.subscribersCount || 0}
                  compact
                />
                <StatCard
                  label="Subscriptions"
                  value={channel.subscribedToCount || 0}
                  compact
                />
              </div>

              {typeof channel.isSubscribed === "boolean" && (
                <div
                  className={`mt-5 inline-block px-5 py-1 rounded-full font-semibold select-none text-base sm:text-lg ${
                    channel.isSubscribed
                      ? "bg-error text-base-100 shadow-md"
                      : "bg-gray-400 text-base-content"
                  } transition duration-300`}
                >
                  {channel.isSubscribed ? "Subscribed" : "Not Subscribed"}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Channel Stats */}
      {channelStats && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 dark:bg-base-200 rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-error uppercase tracking-widest">
            Channel Stats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 text-center">
            <StatCard label="Total Views" value={channelStats.totalViews} compact />
            <StatCard label="Total Likes" value={channelStats.totalLikes} compact />
            <StatCard label="Subscribers" value={channelStats.totalSubscribers} compact />
            <StatCard label="Videos Uploaded" value={channelStats.totalVideos} compact />
          </div>
        </motion.section>
      )}

      {/* Channel Videos */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-error uppercase tracking-wide">
          My Uploaded Videos
        </h2>
        {channelVideos.length === 0 ? (
          <p className="text-gray-500 text-base sm:text-lg select-none">
            You have not uploaded any videos yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {channelVideos.map((video) => (
              <motion.div
                key={video._id}
                whileHover={{ scale: 1.04 }}
                className="bg-base-100 dark:bg-base-200 rounded-xl shadow-md cursor-pointer overflow-hidden transition-transform duration-300"
                title={video.title}
                onClick={() => setSelectedVideo(video)}
              >
                <img
                  src={video.thumbnail || "/default-thumbnail.jpg"}
                  alt={video.title}
                  className="w-full h-36 sm:h-40 object-cover border-b-4 border-error"
                  onError={(e) => (e.currentTarget.src = "/default-thumbnail.jpg")}
                />
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 truncate">
                    {video.title}
                  </h3>
                  <div className="mt-2 text-gray-500 text-xs sm:text-sm flex justify-between font-mono tracking-wide">
                    <span>{video.views?.toLocaleString() || 0} views</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Watch History */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-error uppercase tracking-wide">
            Watch History
          </h2>
          <button
            onClick={handleDeleteHistory}
            disabled={deleting || watchHistory.length === 0}
            className={`px-4 sm:px-5 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 shadow-md ${
              deleting || watchHistory.length === 0
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-error hover:bg-error-focus text-base-100"
            }`}
          >
            {deleting ? "Deleting..." : "Delete Watch History"}
          </button>
        </div>

        {watchHistory.length === 0 ? (
          <p className="text-gray-500 text-base sm:text-lg select-none">
            Your watch history is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {watchHistory.map((video) => (
              <motion.div
                key={video._id}
                whileHover={{ scale: 1.04 }}
                className="bg-base-100 dark:bg-base-200 rounded-xl shadow-md cursor-pointer overflow-hidden transition-transform duration-300"
                title={video.title}
                onClick={() => setSelectedVideo(video)}
              >
                <img
                  src={video.thumbnail || "/default-thumbnail.jpg"}
                  alt={video.title}
                  className="w-full h-36 sm:h-40 object-cover border-b-4 border-error"
                  onError={(e) =>
                    (e.currentTarget.src = "/default-thumbnail.jpg")
                  }
                />
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 truncate">
                    {video.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-gray-500 text-xs sm:text-sm font-mono tracking-wide">
                    <img
                      src={video.owner?.avatar || "/default-avatar.png"}
                      alt={video.owner?.fullName}
                      className="w-6 sm:w-7 h-6 sm:h-7 rounded-full object-cover border-2 border-error shadow-sm"
                      onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                    />
                    <span>{video.owner?.fullName}</span>
                  </div>
                  <div className="mt-2 text-gray-500 text-xs sm:text-sm flex justify-between font-mono tracking-wide">
                    <span>{video.views?.toLocaleString() || 0} views</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, compact }) => (
  <div className="bg-base-200 dark:bg-base-300 rounded-2xl shadow-md p-5 cursor-default select-none transition-transform duration-300 hover:scale-105">
    <p
      className={`font-extrabold text-error ${
        compact ? "text-3xl" : "text-4xl"
      }`}
    >
      {value.toLocaleString()}
    </p>
    <p
      className={`mt-1 text-gray-500 uppercase tracking-wider font-semibold ${
        compact ? "text-sm" : "text-base"
      }`}
    >
      {label}
    </p>
  </div>
);

export default UserDashboard;
