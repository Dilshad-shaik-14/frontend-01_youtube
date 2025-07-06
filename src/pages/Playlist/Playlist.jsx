// src/pages/PlaylistDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getVideoById
} from "../../Index/api"; 


export default function PlaylistDetailsPage() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newVideoId, setNewVideoId] = useState("");

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await getPlaylistById(playlistId);
        setPlaylist(data.playlist);
        setVideos(data.playlist.videos || []);
        setNewName(data.playlist.name);
        setNewDescription(data.playlist.description);
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) fetchPlaylist();
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await removeVideoFromPlaylist(videoId, playlistId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Failed to remove video:", err);
    }
  };

  const handleAddVideo = async () => {
    try {
      await addVideoToPlaylist(newVideoId, playlistId);
      const res = await getVideoById(newVideoId); // call your video API to fetch it
      setVideos((prev) => [...prev, res.video]);
      setNewVideoId("");
    } catch (err) {
      console.error("Failed to add video:", err);
    }
  };

  const handleEditSave = async () => {
    try {
      const updated = await updatePlaylist(playlistId, {
        name: newName,
        description: newDescription,
      });
      setPlaylist(updated.playlist);
      setEditMode(false);
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDeletePlaylist = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirmDelete) return;

    try {
      await deletePlaylist(playlistId);
      navigate("/playlists");
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  if (loading) return <p className="text-zinc-500">Loading playlist...</p>;
  if (!playlist) return <p className="text-red-500">Playlist not found</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-4">
        <div>
          {editMode ? (
            <div className="space-y-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditSave}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="text-sm text-zinc-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">{playlist.name}</h2>
              <p className="text-sm text-zinc-500">{playlist.description}</p>
              <div className="mt-2 flex gap-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="text-blue-500 text-sm hover:underline"
                >
                  Edit Playlist
                </button>
                <button
                  onClick={handleDeletePlaylist}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete Playlist
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newVideoId}
            onChange={(e) => setNewVideoId(e.target.value)}
            placeholder="Video ID"
            className="px-2 py-1 text-sm border rounded dark:bg-zinc-800 dark:border-zinc-700"
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
          <div
            key={video._id}
            className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow"
          >
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
