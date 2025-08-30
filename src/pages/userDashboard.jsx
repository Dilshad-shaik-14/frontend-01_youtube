import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  getUserChannelProfile,
  getChannelStats,
  getChannelVideos,
  getWatchHistory,
} from "../Index/api";

// ✅ Reusable Stat Card
const StatCard = ({ title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-2xl shadow-md p-6 text-center"
  >
    <h3 className="text-lg font-medium text-gray-600">{title}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </motion.div>
);

// ✅ Channel Profile Component
const ChannelProfile = ({ channel }) => (
  <div className="flex flex-col items-center">
    <img
      src={channel.coverImage || "/default-cover.jpg"}
      alt="cover"
      className="w-full h-48 object-cover rounded-2xl shadow"
      onError={(e) => (e.target.src = "/default-cover.jpg")}
    />
    <motion.img
      src={channel.avatar || "/default-avatar.png"}
      alt={`${channel.fullName}'s avatar`}
      className="w-32 h-32 rounded-full border-4 border-white -mt-16 object-cover shadow-lg"
      onError={(e) => (e.target.src = "/default-avatar.png")}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    />
    <h1 className="text-2xl font-bold mt-4">{channel.fullName}</h1>
    <p className="text-gray-500">@{channel.username}</p>
    <p className="text-gray-600 mt-2">{channel.bio}</p>
  </div>
);

// ✅ Channel Stats Component
const ChannelStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
    <StatCard title="Subscribers" value={stats.subscribersCount} />
    <StatCard title="Videos" value={stats.totalVideos} />
    <StatCard title="Views" value={stats.totalViews} />
  </div>
);

// ✅ Video Grid Component
const VideoGrid = ({ videos }) => (
  <div className="mt-10">
    <h2 className="text-xl font-bold mb-4">Your Videos</h2>
    {(!videos || videos.length === 0) ? (
      <p className="text-gray-500">You have not uploaded any videos yet.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <motion.div
            key={video._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow p-4 cursor-pointer"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              className="rounded-xl object-cover w-full h-40"
              onError={(e) => (e.target.src = "/default-thumbnail.jpg")}
            />
            <h3 className="font-semibold mt-2">{video.title}</h3>
            <p className="text-gray-500 text-sm">
              {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

// ✅ Watch History Component
const WatchHistory = ({ history }) => (
  <div className="mt-10">
    <h2 className="text-xl font-bold mb-4">Watch History</h2>
    {(!history || history.length === 0) ? (
      <p className="text-gray-500">Your watch history is empty.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {history.map((video) => (
          <motion.div
            key={video._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow p-4 cursor-pointer"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              className="rounded-xl object-cover w-full h-40"
              onError={(e) => (e.target.src = "/default-thumbnail.jpg")}
            />
            <h3 className="font-semibold mt-2">{video.title}</h3>
            <p className="text-gray-500 text-sm">
              {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

// ✅ Main Dashboard Component
export default function UserDashboard() {
  const { userName, channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [channelStats, setChannelStats] = useState({});
  const [channelVideos, setChannelVideos] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!userName || !channelId) return;

        const [channelRes, statsRes, videosRes, historyRes] = await Promise.all([
          getUserChannelProfile(userName),
          getChannelStats(channelId),
          getChannelVideos(channelId),
          getWatchHistory(),
        ]);

        if (isMounted) {
          setChannel(channelRes.data);
          setChannelStats(statsRes.data);
          setChannelVideos(videosRes.data.videos);
          setWatchHistory(historyRes.data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [userName, channelId]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="p-6">
      {channel && (
        <>
          <ChannelProfile channel={channel} />
          <ChannelStats stats={channelStats} />
          <VideoGrid videos={channelVideos} />
          <WatchHistory history={watchHistory} />
        </>
      )}
    </div>
  );
}
