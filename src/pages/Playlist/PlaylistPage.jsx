import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserPlaylists } from "../../Index/api";

import CreatePlaylistModal from "../../components/Playlist/CreatePlaylistModal";
import ItemCard from "../../components/Playlist/ItemCard";
import PlaylistVideoList from "../../components/Playlist/PlaylistVideoList";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import VideoSelectionModal from "../../components/Playlist/videoSelectionModal";

export default function PlaylistsPage() {
  const user = useSelector((state) => state.auth?.currentUser);
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState(null);
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
    <div className="min-h-screen bg-base-100 text-base-content font-inter flex flex-col px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {!activePlaylist ? (
        <>
          {/* Page Heading */}
          <motion.h1
            className="text-5xl sm:text-4xl md:text-4xl font-bold text-base-content mb-10 border-b-2 border-red-500 pb-2 w-fit"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Your Playlists
          </motion.h1>

          {/* Playlists Grid */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <ItemCard
                key={playlist._id}
                playlist={playlist}
                refresh={fetchPlaylists}
                onClick={() => setActivePlaylist(playlist)}
                className="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg p-4 rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105 h-[40rem] md:h-[42rem]"
              />
            ))}
          </div>

          {/* Floating Create Playlist Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/70 transition-all text-base font-semibold"
            aria-label="Create Playlist"
          >
            <PlusCircle size={20} />
            Create Playlist
          </motion.button>
        </>
      ) : (
        <>
          {/* Back Button */}
          <button
            onClick={() => setActivePlaylist(null)}
            className="btn btn-ghost mb-4 flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Playlists
          </button>


{/* Playlist Cover */}
<div className="card bg-base-100 border border-base-300 shadow-xl rounded-2xl overflow-hidden relative">
  {activePlaylist.coverImage ? (
    <img
      src={activePlaylist.coverImage}
      alt={`${activePlaylist.name} cover`}
      className="w-full h-80 md:h-[500px] object-cover"
    />
  ) : (
    <div className="h-80 md:h-[500px] w-full grid place-items-center bg-base-200 text-base-content">
      No Cover Image
    </div>
  )}

  {/* Overlay gradient & theme-aware text (uses base-100 so it adapts to the active DaisyUI theme) */}
  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-10 bg-gradient-to-t from-base-100/70 via-transparent to-transparent">
    {/* Playlist Name (adapts color via text-base-content) */}
    <h1 className="text-3xl md:text-5xl font-extrabold text-base-content">
      {activePlaylist.name}
    </h1>

    {/* Playlist Description */}
    {activePlaylist.description && (
      <p className="text-sm md:text-lg mt-2 text-base-content/70 line-clamp-3">
        {activePlaylist.description}
      </p>
    )}

    {/* Videos Count & Add Button */}
    <div className="flex items-center gap-4 mt-4">
      <span className="text-sm md:text-base text-base-content/70">
        {Array.isArray(activePlaylist.videos)
          ? `${activePlaylist.videos.length} video${activePlaylist.videos.length === 1 ? "" : "s"}`
          : "0 videos"}
      </span>

      {/* Red curved button with highlighted text size */}
      <button
        onClick={() => setShowVideoModal(true)}
        className="btn btn-error btn-lg rounded-full text-lg font-bold px-6 shadow-lg"
      >
        Add Video
      </button>
    </div>
  </div>
</div>

          {/* Playlist Videos */}
          {activePlaylist._id && (
            <PlaylistVideoList
              videos={Array.isArray(activePlaylist.videos) ? activePlaylist.videos : []}
              playlistId={activePlaylist._id}
              refresh={fetchPlaylists}
            />
          )}
        </>
      )}

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
        {showVideoModal && activePlaylist?._id && (
          <VideoSelectionModal
            playlistId={activePlaylist._id}
            onClose={() => setShowVideoModal(false)}
            onVideoAdded={(newVideo) => {
              setActivePlaylist((prev) =>
                prev ? { ...prev, videos: [...(prev.videos || []), newVideo] } : prev
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
