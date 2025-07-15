// src/pages/Playlist/AllPlaylists.jsx
import React, { useEffect, useState } from "react";
import { getUserPlaylists } from "../../Index/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CreatePlaylistModal from "../../components/Playlist/CreatePlaylistModal";

export default function AllPlaylists() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch playlists
  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await getUserPlaylists(currentUser._id);
      setPlaylists(res?.data?.playlists || []);
    } catch (err) {
      console.error("Failed to fetch playlists", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?._id) fetchPlaylists();
  }, [currentUser]);

  const handleNewPlaylist = (newPlaylist) => {
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">My Playlists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          ➕ Create Playlist
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-400">Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p className="text-zinc-400">You haven't created any playlists yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              to={`/playlists/${playlist._id}`}
              className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                {playlist.name}
              </h2>
              <p className="text-sm text-zinc-500 line-clamp-2">
                {playlist.description}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                🎞 {playlist.videos.length} {playlist.videos.length === 1 ? "video" : "videos"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleNewPlaylist}
        />
      )}
    </div>
  );
}
