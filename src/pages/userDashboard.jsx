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

const FALLBACK_AVATAR = "https://via.placeholder.com/150";
const FALLBACK_COVER = "https://via.placeholder.com/1200x400";

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
        toast.error("User not logged in or missing info");
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

        const channelData = channelRes.data || {};
        // guarantee avatar and cover
        channelData.avatar = channelData.avatar || FALLBACK_AVATAR;
        channelData.coverImage = channelData.coverImage || FALLBACK_COVER;

        setChannel(channelData);
        setChannelStats(statsRes.data || {});
        setChannelVideos(videosRes.data?.videos || []);
        setWatchHistory(historyRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userName, channelId]);

  const handleDeleteHistory = async () => {
    if (!window.confirm("Delete entire watch history? This cannot be undone.")) return;

    try {
      setDeleting(true);
      await deleteHistory();
      setWatchHistory([]);
      toast.success("Watch history deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete history");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-10 py-14 max-w-[1440px] mx-auto space-y-12">
      {/* Channel Profile */}
      {channel && (
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl shadow-lg overflow-hidden">
          {/* Cover Banner */}
          <div
            className="w-full h-40 sm:h-44 bg-cover bg-center border-b-4 border-red-500"
            style={{ backgroundImage: `url(${channel.coverImage})` }}
            aria-label="Channel Cover Image"
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start px-10 py-5 gap-6">
            <motion.img
              src={channel.avatar}
              alt={`${channel.fullName} avatar`}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-red-500 shadow"
            />

            <div className="flex-1 select-text">
              <h1 className="text-3xl sm:text-4xl font-extrabold">{channel.fullName || "No Name"}</h1>
              <p className="text-gray-500 font-semibold mt-1">@{channel.userName || "unknown"}</p>
              <p className="mt-2 text-gray-400 text-sm">{channel.email || "No Email"}</p>

              <div className="mt-5 flex flex-wrap gap-6 font-semibold text-lg">
                <StatCard label="Subscribers" value={channel.subscribersCount || 0} compact />
                <StatCard label="Subscriptions" value={channel.subscribedToCount || 0} compact />
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Channel Stats */}
      {channelStats && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-red-500 uppercase tracking-widest">Channel Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <StatCard label="Total Views" value={channelStats.totalViews || 0} compact />
            <StatCard label="Total Likes" value={channelStats.totalLikes || 0} compact />
            <StatCard label="Subscribers" value={channelStats.totalSubscribers || 0} compact />
            <StatCard label="Videos Uploaded" value={channelStats.totalVideos || 0} compact />
          </div>
        </motion.section>
      )}

      {/* Channel Videos */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-red-500 uppercase tracking-wide">My Uploaded Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {channelVideos.length > 0 ? channelVideos.map((video) => (
            <motion.div key={video._id} whileHover={{ scale: 1.04 }} className="rounded-xl shadow-md overflow-hidden">
              <img src={video.thumbnail || FALLBACK_COVER} alt={video.title || "No title"} className="w-full h-36 sm:h-40 object-cover" />
              <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-semibold truncate">{video.title || "Untitled"}</h3>
                <p className="text-gray-500 text-xs sm:text-sm">{new Date(video.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </motion.div>
          )) : <p>No uploaded videos yet.</p>}
        </div>
      </section>

      {/* Watch History */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-500 uppercase tracking-wide">Watch History</h2>
          <button
            onClick={handleDeleteHistory}
            disabled={deleting || watchHistory.length === 0}
            className={`px-4 py-2 rounded-xl font-semibold ${deleting || watchHistory.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 text-white"}`}
          >
            {deleting ? "Deleting..." : "Delete Watch History"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {watchHistory.length > 0 ? watchHistory.map((video) => (
            <motion.div key={video._id} whileHover={{ scale: 1.04 }} className="rounded-xl shadow-md overflow-hidden">
              <img src={video.thumbnail || FALLBACK_COVER} alt={video.title || "No title"} className="w-full h-36 sm:h-40 object-cover" />
              <div className="p-4 sm:p-5 flex items-center gap-2">
                <img src={video.owner?.avatar || FALLBACK_AVATAR} alt={video.owner?.fullName || "User"} className="w-6 h-6 rounded-full object-cover" />
                <span>{video.owner?.fullName || "Unknown"}</span>
              </div>
            </motion.div>
          )) : <p>Your watch history is empty.</p>}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

const StatCard = ({ label, value, compact }) => (
  <div className="rounded-2xl shadow-md p-5 cursor-default">
    <p className={`font-extrabold text-red-500 ${compact ? "text-3xl" : "text-4xl"}`}>{value?.toLocaleString() || 0}</p>
    <p className={`mt-1 text-gray-500 uppercase tracking-wider font-semibold ${compact ? "text-sm" : "text-base"}`}>{label}</p>
  </div>
);

export default UserDashboard;
