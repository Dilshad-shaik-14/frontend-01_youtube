// src/pages/PlaylistsPage.jsx

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
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

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
    <div className="px-6 py-10 max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">📂 Your Playlists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md shadow-md"
        >
          <PlusCircle size={20} />
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Playlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playlists.map((playlist) => (
          <motion.div
            key={playlist._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900 rounded-xl p-5 border border-zinc-700 shadow-lg"
          >
            {/* Playlist Card (Edit/Delete) */}
            <ItemCard playlist={playlist} refresh={fetchPlaylists} />

            {/* Video List */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-white">🎬 Videos</h4>
                <button
                  onClick={() => {
                    setSelectedPlaylistId(playlist._id);
                    setShowVideoModal(true);
                  }}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Add Video
                </button>
              </div>
              <PlaylistVideoList
                videos={playlist.videos}
                playlistId={playlist._id}
                refresh={fetchPlaylists}
              />
            </div>
          </motion.div>
        ))}
      </div>

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
    </div>
  );
};

export default PlaylistsPage;
