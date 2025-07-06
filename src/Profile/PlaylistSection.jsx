import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../components/VideoCard";

export default function PlaylistSection({ userId }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get(`/playlists?owner=${userId}`);
        setPlaylists(Array.isArray(res.data) ? res.data : res.data.playlists || []);
      } catch (err) {
        console.error("Failed to fetch playlists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userId]);

  if (loading) return <p className="text-zinc-500">Loading playlists...</p>;
  if (playlists.length === 0) return <p className="text-zinc-500">No playlists yet.</p>;

  return (
    <div className="space-y-8">
      {playlists.map((playlist) => (
        <div key={playlist._id}>
          <h3 className="text-xl font-semibold mb-2">{playlist.name}</h3>
          {playlist.description && (
            <p className="text-sm text-zinc-500 mb-3">{playlist.description}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playlist.videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

