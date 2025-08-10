import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserPlaylists } from "../../Index/api";

import CreatePlaylistModal from "../../components/Playlist/CreatePlaylistModal";
import ItemCard from "../../components/Playlist/ItemCard";
import PlaylistVideoList from "../../components/Playlist/PlaylistVideoList";
import VideoSelectionModal from "../../components/Playlist/VideoSelectionModal";

import { PlusCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

const PlaylistsPage = () => {
  const user = useSelector((state) => state.auth.currentUser);
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
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
    <div className="min-h-screen bg-[#0f0f0f] text-white font-inter flex">
      <main className="flex-1 px-6 py-10 overflow-auto relative">
        {/* Title */}
        <motion.h1
          className="text-4xl font-bold tracking-tight mb-10 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Playlists
        </motion.h1>

        {/* Playlist Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10">
          {playlists.map((playlist) => (
            <motion.div
              key={playlist._id}
              className="bg-[#181818] border border-[#303030] rounded-xl p-6 shadow-lg hover:scale-[1.02] transition-transform duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              tabIndex={0}
            >
              <ItemCard playlist={playlist} refresh={fetchPlaylists} />

              <div className="mt-6 border-t border-[#303030] pt-4 bg-[#0f0f0f]/50 rounded-xl px-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-white/90">🎬 Videos</h4>
                  <button
                    onClick={() => {
                      setSelectedPlaylistId(playlist._id);
                      setShowVideoModal(true);
                    }}
                    className="text-sm text-red-400 hover:text-red-300 transition"
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
                    onVideoClick={(video) => setSelectedVideo(video)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Playlist Floating Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg transition-colors"
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

      {selectedVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-[1200px] sm:max-w-[90vw] rounded-xl overflow-hidden bg-[#181818] border border-[#303030] shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white bg-[#303030] hover:bg-red-600 p-2 rounded-full text-xl z-50"
            >
              ✕
            </button>

            {/* Video Player */}
            <div className="w-full aspect-video bg-black">
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Video Info */}
            <div className="p-6 border-t border-[#303030]">
              <h2 className="text-2xl font-bold text-white">{selectedVideo.title}</h2>
              {selectedVideo.description && (
                <p className="text-base text-gray-400 mt-2">
                  {selectedVideo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;
