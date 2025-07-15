import React, { useEffect, useState } from "react";
import { getChannelVideos, addVideoToPlaylist, getVideoById } from "../../Index/api";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function VideoSelectionModal({ playlistId, onClose, onVideoAdded }) {
  const user = useSelector((state) => state.auth.currentUser);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getChannelVideos(user._id);
        setVideos(res?.data?.videos || []);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [user]);

  const handleAdd = async (videoId) => {
    try {
      await addVideoToPlaylist(videoId, playlistId);
      const res = await getVideoById(videoId);
      toast.success("Video added to playlist!");
      onVideoAdded(res.video);
      onClose();
    } catch (err) {
      console.error("Failed to add video to playlist:", err);
      toast.error("Failed to add video");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-900 w-full max-w-3xl rounded-xl p-6 relative overflow-y-auto max-h-[90vh] border border-zinc-700 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-red-500 transition"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-white mb-4">
            Select a Video to Add
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-800 animate-pulse h-40 rounded"
                ></div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <p className="text-zinc-400">You haven’t uploaded any videos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  key={video._id}
                  onClick={() => handleAdd(video._id)}
                  className="bg-zinc-800 p-3 rounded-xl shadow cursor-pointer hover:bg-zinc-700 hover:scale-[1.02] transition duration-200"
                >
                  <img
                    src={video.thumbnail || "/default-thumbnail.jpg"}
                    alt={video.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="text-sm text-white font-medium truncate">
                    {video.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
