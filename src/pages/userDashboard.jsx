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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0f0f0f] to-[#121212] text-white text-xl select-none font-semibold tracking-wide">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#121212] text-white px-10 py-14 max-w-[1440px] mx-auto space-y-12">
      {/* Channel Profile */}
      {channel && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[rgba(32,32,32,0.85)] backdrop-blur-md rounded-2xl shadow-youtube-glow transition-shadow duration-400 hover:shadow-youtube-glow-strong overflow-hidden"
        >
          {/* Cover Banner */}
          <div
            className="w-full h-40 sm:h-44 bg-cover bg-center border-b-4 border-youtubeRed hover:brightness-105 transition duration-300 cursor-pointer"
            style={{ backgroundImage: `url(${channel.coverImage || "/default-cover.jpg"})` }}
            aria-label="Channel Cover Image"
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start px-10 py-5 gap-6">
            <motion.img
              src={channel.avatar || "/default-avatar.png"}
              alt={`${channel.fullName} avatar`}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-youtubeRed shadow-youtube-glow bg-black"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            <div className="flex-1 select-text">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide drop-shadow-lg">
                {channel.fullName}
              </h1>
              <p className="text-md sm:text-lg text-gray-400 font-semibold tracking-wide mt-1">
                @{channel.userName}
              </p>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">{channel.email}</p>

              <div className="mt-5 flex flex-wrap gap-6 font-semibold text-lg cursor-default">
                <StatCard label="Subscribers" value={channel.subscribersCount || 0} compact />
                <StatCard label="Subscriptions" value={channel.subscribedToCount || 0} compact />
              </div>

              {typeof channel.isSubscribed === "boolean" && (
                <div
                  className={`mt-5 inline-block px-5 py-1 rounded-full font-semibold select-none text-base sm:text-lg ${
                    channel.isSubscribed
                      ? "bg-youtubeRed text-white shadow-youtube-glow-strong"
                      : "bg-gray-700 text-gray-300"
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
          className="bg-[rgba(24,24,24,0.85)] backdrop-blur-md rounded-2xl shadow-youtube-glow p-6 sm:p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-youtubeRed uppercase tracking-widest drop-shadow-lg select-none">
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
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-youtubeRed uppercase tracking-wide drop-shadow-md select-none">
          My Uploaded Videos
        </h2>
        {channelVideos.length === 0 ? (
          <p className="text-gray-400 text-base sm:text-lg select-none">
            You have not uploaded any videos yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 select-none">
            {channelVideos.map((video) => (
              <motion.div
                key={video._id}
                whileHover={{ scale: 1.04, boxShadow: "0 0 12px 2px rgba(255,0,0,0.45)" }}
                className="bg-[rgba(24,24,24,0.9)] backdrop-blur-sm rounded-xl shadow-youtube-glow-soft cursor-pointer overflow-hidden transition-transform duration-300"
                title={video.title}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-36 sm:h-40 object-cover border-b-4 border-youtubeRed transition duration-300 hover:brightness-110"
                />
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 truncate text-white">
                    {video.title}
                  </h3>
                  <div className="mt-2 text-gray-400 text-xs sm:text-sm flex justify-between font-mono tracking-wide">
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
        <div className="flex justify-between items-center mb-6 select-none">
          <h2 className="text-2xl sm:text-3xl font-bold text-youtubeRed uppercase tracking-wide drop-shadow-md">
            Watch History
          </h2>
          <button
            onClick={handleDeleteHistory}
            disabled={deleting || watchHistory.length === 0}
            className={`px-4 sm:px-5 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 select-none shadow-lg ${
              deleting || watchHistory.length === 0
                ? "bg-gray-700 cursor-not-allowed text-gray-400 shadow-none"
                : "bg-youtubeRed hover:bg-youtubeRedDark text-white shadow-youtube-glow-strong"
            }`}
          >
            {deleting ? "Deleting..." : "Delete Watch History"}
          </button>
        </div>

        {watchHistory.length === 0 ? (
          <p className="text-gray-400 text-base sm:text-lg select-none">Your watch history is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 select-none">
            {watchHistory.map((video) => (
              <motion.div
                key={video._id}
                whileHover={{ scale: 1.04, boxShadow: "0 0 12px 2px rgba(255,0,0,0.45)" }}
                className="bg-[rgba(24,24,24,0.9)] backdrop-blur-sm rounded-xl shadow-youtube-glow-soft cursor-pointer overflow-hidden transition-transform duration-300"
                title={video.title}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-36 sm:h-40 object-cover border-b-4 border-youtubeRed transition duration-300 hover:brightness-110"
                />
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 truncate text-white">{video.title}</h3>
                  <div className="flex items-center space-x-3 text-gray-400 text-xs sm:text-sm font-mono tracking-wide">
                    <img
                      src={video.owner?.avatar || "/default-avatar.png"}
                      alt={video.owner?.fullName}
                      className="w-6 sm:w-7 h-6 sm:h-7 rounded-full object-cover border-2 border-youtubeRed shadow-youtube-glow-soft transition-transform duration-300 hover:scale-110"
                    />
                    <span>{video.owner?.fullName}</span>
                  </div>
                  <div className="mt-2 text-gray-400 text-xs sm:text-sm flex justify-between font-mono tracking-wide">
                    <span>{video.views?.toLocaleString() || 0} views</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ label, value, compact }) => (
  <div
    className={`bg-[rgba(18,18,18,0.8)] rounded-2xl shadow-inner shadow-youtube-glow-soft transition-transform duration-300 cursor-default select-none ${
      compact ? "p-5" : "p-7"
    } hover:scale-110`}
  >
    <p className={`font-extrabold text-youtubeRed drop-shadow-lg ${compact ? "text-3xl" : "text-4xl"}`}>
      {value.toLocaleString()}
    </p>
    <p className={`mt-1 text-gray-400 uppercase tracking-wider font-semibold ${compact ? "text-sm" : "text-base"}`}>
      {label}
    </p>
  </div>
);

export default UserDashboard;
