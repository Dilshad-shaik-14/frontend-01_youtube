// src/components/Playlist/PlaylistVideoList.jsx

import React, { useEffect, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { removeVideoFromPlaylist } from "../../Index/api";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";

// ✅ Sortable video card
function SortableVideoCard({ video, id, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-zinc-800 p-3 rounded-lg relative overflow-hidden group transition hover:shadow-lg cursor-grab"
    >
      <img
        src={video.thumbnail || "/default-thumbnail.jpg"}
        alt={video.title}
        className="w-full h-32 object-cover rounded mb-2"
      />
      <h3 className="text-white text-sm font-semibold truncate">
        {video.title}
      </h3>

      <button
        onClick={() => {
          const confirmed = window.confirm("Remove this video from the playlist?");
          if (confirmed) onRemove(video._id);
        }}
        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
        title="Remove from playlist"
      >
        <XCircle size={18} />
      </button>
    </div>
  );
}

// ✅ Main list component
const PlaylistVideoList = ({ videos = [], playlistId, refresh }) => {
  const [videoItems, setVideoItems] = useState([]);

  useEffect(() => {
    setVideoItems(videos);
  }, [videos]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleRemove = async (videoId) => {
    const prevVideos = [...videoItems]; // backup
    const updated = videoItems.filter((v) => v._id !== videoId);
    setVideoItems(updated); // optimistic update

    try {
      await removeVideoFromPlaylist(videoId, playlistId);
      toast.success("Video removed from playlist");
      refresh(); // sync with backend
    } catch (err) {
      console.error("Error removing video:", err);
      toast.error("Failed to remove video");
      setVideoItems(prevVideos); // rollback
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = videoItems.findIndex((v) => v._id === active.id);
      const newIndex = videoItems.findIndex((v) => v._id === over.id);
      const newList = arrayMove(videoItems, oldIndex, newIndex);
      setVideoItems(newList);

      // You can send reorder to backend here if needed
      // await reorderPlaylist(playlistId, newList.map(v => v._id));
    }
  };

  if (!videoItems || videoItems.length === 0) {
    return <p className="text-zinc-400 mt-2">No videos in this playlist.</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={videoItems.map((video) => video._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videoItems.map((video) => (
            <SortableVideoCard
              key={video._id}
              id={video._id}
              video={video}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default PlaylistVideoList;
