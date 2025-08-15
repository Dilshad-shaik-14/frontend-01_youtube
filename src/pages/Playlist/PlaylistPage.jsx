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

const PlaylistsPage = () => {
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
    <div className="min-h-screen bg-[#0f0f0f] text-white font-inter flex">
      <main className="flex-1 px-6 py-8 overflow-auto relative max-w-[1600px] mx-auto w-full">
        {!activePlaylist ? (
          <>
            {/* Page Heading */}
            <motion.h1
              className="text-5xl sm:text-4xl md:text-4xl font-bold text-white mb-10 border-b-4 border-red-600 pb-3 w-fit"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Your Playlists
            </motion.h1>

            {/* Playlist Grid */}
            <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {playlists.map((playlist) => (
                <motion.div
                  key={playlist._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                >
                  <ItemCard
                    playlist={playlist}
                    refresh={fetchPlaylists}
                    onClick={() => setActivePlaylist(playlist)}
                    className="h-[40rem] md:h-[42rem] rounded-3xl shadow-4xl border border-zinc-700 hover:shadow-5xl hover:scale-[1.08] transition-all duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={() => setActivePlaylist(null)}
                className="inline-flex items-center gap-2 text-zinc-300 hover:text-white mb-4"
              >
                <ArrowLeft size={18} />
                Back to Playlists
              </button>

              {/* Full-width cover image */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
                {activePlaylist?.coverImage ? (
                  <img
                    src={activePlaylist.coverImage}
                    alt={`${activePlaylist.name} cover`}
                    className="w-full h-[300px] md:h-[500px] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-[300px] md:h-[500px] w-full grid place-items-center bg-zinc-800 text-zinc-500">
                    No Cover Image
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                {/* Text content and Add Video button */}
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-12 flex flex-col gap-4 max-w-lg">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                    {activePlaylist?.name}
                  </h1>
                  {activePlaylist?.description && (
                    <p className="text-sm md:text-lg text-white/80 line-clamp-3 drop-shadow-sm">
                      {activePlaylist.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-sm md:text-base text-white/80 drop-shadow-md">
                      {Array.isArray(activePlaylist?.videos)
                        ? `${activePlaylist.videos.length} video${
                            activePlaylist.videos.length === 1 ? "" : "s"
                          }`
                        : "0 videos"}
                    </span>
                    <button
                      onClick={() => setShowVideoModal(true)}
                      className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-full font-bold text-white shadow-xl transition-transform duration-300 hover:scale-105"
                    >
                      Add Video
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Playlist Videos */}
            {activePlaylist?._id && (
              <PlaylistVideoList
                videos={Array.isArray(activePlaylist.videos) ? activePlaylist.videos : []}
                playlistId={activePlaylist._id}
                refresh={fetchPlaylists}
              />
            )}
          </>
        )}

        {/* Floating Create Playlist Button */}
        {!activePlaylist && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/70 transition-all text-base font-semibold"
            aria-label="Create Playlist"
          >
            <PlusCircle size={20} />
            Create Playlist
          </motion.button>
        )}
      </main>

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
};

export default PlaylistsPage;
