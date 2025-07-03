import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function PlaylistDetailsPage() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newVideoId, setNewVideoId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(`/api/v1/playlists/${playlistId}`);
        setPlaylist(res.data.playlist);
        setVideos(res.data.playlist.videos || []);
        setNewName(res.data.playlist.name);
        setNewDescription(res.data.playlist.description);
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await axios.patch(`/api/v1/playlists/${playlistId}/remove`, { videoId });
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Failed to remove video:", err);
    }
  };

  const handleAddVideo = async () => {
    try {
      await axios.patch(`/api/v1/playlists/${playlistId}/add`, { videoId: newVideoId });
      const res = await axios.get(`/api/v1/videos/${newVideoId}`);
      setVideos((prev) => [...prev, res.data.video]);
      setNewVideoId("");
    } catch (err) {
      console.error("Failed to add video:", err);
    }
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(`/api/v1/playlists/${playlistId}`, {
        name: newName,
        description: newDescription,
      });
      setPlaylist(res.data.playlist);
      setEditMode(false);
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDeletePlaylist = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/v1/playlists/${playlistId}`);
      navigate("/playlists");
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  if (loading) return <p className="text-zinc-500">Loading playlist...</p>;
  if (!playlist) return <p className="text-red-500">Playlist not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          {editMode ? (
            <div className="space-y-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <button onClick={handleEditSave} className="bg-green-600 text-white px-3 py-1 rounded">
                Save
              </button>
              <button onClick={() => setEditMode(false)} className="text-sm text-zinc-500 ml-2">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">{playlist.name}</h2>
              <p className="text-sm text-zinc-500">{playlist.description}</p>
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-500 text-sm hover:underline mt-1"
              >
                Edit Playlist
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="text-red-500 text-sm hover:underline ml-4"
              >
                Delete Playlist
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newVideoId}
            onChange={(e) => setNewVideoId(e.target.value)}
            placeholder="Video ID"
            className="px-2 py-1 text-sm border rounded"
          />
          <button
            onClick={handleAddVideo}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Add Video
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div key={video._id} className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow">
            <img
              src={video.thumbnail || "/default-thumbnail.jpg"}
              alt={video.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="mt-2 font-semibold text-lg truncate">{video.title}</h3>
            <p className="text-sm text-zinc-500 line-clamp-2">{video.description}</p>
            <button
              onClick={() => handleRemoveVideo(video._id)}
              className="text-xs text-red-500 hover:underline mt-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
