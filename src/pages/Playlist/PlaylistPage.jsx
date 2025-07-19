import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserPlaylists } from "../../Index/api";
import CreatePlaylistModal from "../../components/Playlist/CreatePlaylistModal";
import ItemCard from "../../components/Playlist/ItemCard";
import PlaylistVideoList from "../../components/Playlist/PlaylistVideoList";
import VideoSelectionModal from "../../components/Playlist/VideoSelectionModal";
import VideoPlayerModal from "../../components/VideoPlayerModal"; // ✅ Import

import { PlusCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

const PlaylistsPage = () => {
  const user = useSelector((state) => state.auth.currentUser);
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  // ✅ Modal state for video player
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchPlaylists = async () => {
    try {
      if (!user?._id) return;
      const res = await getUserPlaylists(user._id);
      setPlaylists(res.data.playlists || []);
    } catch (err) {
      console.error("Error fetching playlists:", err);
      toast.error(err?.response?.data?.message || "Failed to load playlists");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1c1c1c] to-[#121212] text-white font-inter flex">
      <main className="flex-1 px-6 py-10 overflow-auto relative">
        <motion.h1
          className="text-4xl font-bold tracking-tight mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Playlists
        </motion.h1>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10">
          {playlists.map((playlist) => (
            <motion.div
              key={playlist._id}
              className="bg-white/5 backdrop-blur-xl border border-zinc-700 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              tabIndex={0}
            >
              <ItemCard playlist={playlist} refresh={fetchPlaylists} />

              <div className="mt-6 border-t border-zinc-700 pt-4 bg-zinc-900/50 rounded-xl px-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-white/90">🎬 Videos</h4>
                  <button
                    onClick={() => {
                      setSelectedPlaylistId(playlist._id);
                      setShowVideoModal(true);
                    }}
                    className="text-sm text-indigo-400 hover:underline"
                  >
                    + Add
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <PlaylistVideoList
                  key={playlist._id + playlist.videos.length}
                  videos={playlist.videos}
                  playlistId={playlist._id}
                  refresh={fetchPlaylists}
                  onRemove={() => {
                    toast.success("Removed video from playlist");
                    fetchPlaylists();
                  }}
                  onVideoClick={(video) => setSelectedVideo(video)} // ✅ play modal
                />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Create Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-xl hover:shadow-pink-500/30 hover:opacity-90 transition"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline-block">Create Playlist</span>
        </motion.button>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePlaylistModal
            onClose={() => setShowCreateModal(false)}
            onCreate={() => {
              fetchPlaylists();
              setShowCreateModal(false);
            }}
          />
        )}

        {showVideoModal && selectedPlaylistId && (
          <VideoSelectionModal
            playlistId={selectedPlaylistId}
            onClose={() => setShowVideoModal(false)}
            onVideoAdded={fetchPlaylists}
          />
        )}
      </AnimatePresence>

      {/* ✅ Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default PlaylistsPage;
