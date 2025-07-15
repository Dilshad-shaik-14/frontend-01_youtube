// PlaylistDetailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  removeVideoFromPlaylist,
} from "../../Index/api.js";
import { useDispatch } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableVideoCard from "../../components/Playlist/SortableVideoCard.jsx";
import VideoSelectionModal from "../../components/Playlist/videoSelectionModal.jsx";
import { reorderVideos, updatePlaylist as updatePlaylistState } from "../../utils/playListSlice.js";

export default function PlaylistDetailPage() {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);

  const videos = playlist?.videos || [];

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        console.log("Fetching playlist with ID:", playlistId);
        const data = await getPlaylistById(playlistId);
        setPlaylist(data.playlist);
        setNewName(data.playlist.name);
        setNewDescription(data.playlist.description);
        dispatch(updatePlaylistState(data.playlist));
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) fetchPlaylist();
  }, [playlistId, dispatch]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await removeVideoFromPlaylist(videoId, playlistId);
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch (err) {
      console.error("Failed to remove video:", err);
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = videos.findIndex((v) => v._id === active.id);
    const newIndex = videos.findIndex((v) => v._id === over.id);
    const newVideos = arrayMove(videos, oldIndex, newIndex);

    setPlaylist((prev) => ({ ...prev, videos: newVideos }));
    dispatch(reorderVideos({ playlistId, oldIndex, newIndex }));
  };

  if (loading) return <p>Loading playlist...</p>;
  if (!playlist) return <p className="text-red-500">Playlist not found</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-4">
        <div>
          {editMode ? (
            <>
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
              <div className="flex gap-2">
                <button onClick={handleEditSave} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                <button onClick={() => setEditMode(false)} className="text-sm text-zinc-500">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">{playlist.name}</h2>
              <p className="text-sm text-zinc-500">{playlist.description}</p>
              <div className="mt-2 flex gap-4">
                <button onClick={() => setEditMode(true)} className="text-blue-500 text-sm hover:underline">Edit</button>
                <button onClick={handleDeletePlaylist} className="text-red-500 text-sm hover:underline">Delete</button>
              </div>
            </>
          )}
        </div>
        <button
          onClick={() => setShowVideoModal(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          ➕ Add from My Videos
        </button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={videos.map((v) => v._id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <SortableVideoCard
                key={video._id}
                video={video}
                onRemove={() => handleRemoveVideo(video._id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showVideoModal && (
        <VideoSelectionModal
          playlistId={playlistId}
          onClose={() => setShowVideoModal(false)}
          onVideoAdded={(video) =>
            setPlaylist((prev) => ({
              ...prev,
              videos: [...prev.videos, video],
            }))
          }
        />
      )}
    </div>
  );
}
