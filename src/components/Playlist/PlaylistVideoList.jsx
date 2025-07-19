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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { XCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { removeVideoFromPlaylist } from "../../Index/api";
import {
  reorderVideos,
  removeVideoFromPlaylistRedux,
} from "../../utils/playListSlice";
import VideoPlayerModal from "../VideoPlayerModal";

// SortableVideoCard component
function SortableVideoCard({ video, id, playlistId, onRemove, onVideoClick }) {
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
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    cursor: "pointer",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:shadow-md transition"
    >
      {/* 📌 Drag handle (icon or edge) */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-grab p-1 bg-zinc-800 rounded-full text-white/60 hover:text-white"
        title="Drag"
        onClick={(e) => e.stopPropagation()}
      >
        ⠿
      </div>

      {/* ✅ Clickable area to open modal */}
      <div
        onClick={() => onVideoClick(video)}
        className="flex flex-col"
      >
        <img
          src={video.thumbnail || "/default-thumbnail.jpg"}
          alt={video.title}
          className="w-full h-36 object-cover"
        />
        <div className="p-3">
          <h3 className="text-white text-sm font-medium truncate">
            {video.title || "Untitled Video"}
          </h3>
        </div>
      </div>

      {/* ❌ Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm("Remove this video from the playlist?")) {
            onRemove(video._id, playlistId);
          }
        }}
        title="Remove video"
        className="absolute top-2 right-2 p-1 rounded-full bg-zinc-800 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
      >
        <XCircle size={18} />
      </button>
    </div>
  );
}


// PlaylistVideoList component
const PlaylistVideoList = ({ videos = [], playlistId, refresh }) => {
  const [videoItems, setVideoItems] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const dispatch = useDispatch();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setVideoItems(videos);
  }, [videos]);

  const handleRemove = async (videoId) => {
    const prevVideos = [...videoItems];
    const updated = videoItems.filter((v) => String(v._id) !== String(videoId));
    setVideoItems(updated);

    const toastId = toast.loading("Removing video...");

    try {
      await removeVideoFromPlaylist(videoId, playlistId);
      dispatch(removeVideoFromPlaylistRedux({ playlistId, videoId }));
      toast.dismiss(toastId);
      toast.success("Video removed from playlist");
      await refresh?.();
    } catch (err) {
      console.error("Error removing video:", err);
      toast.dismiss(toastId);
      toast.error("Failed to remove video");
      setVideoItems(prevVideos);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = videoItems.findIndex((v) => v._id === active.id);
    const newIndex = videoItems.findIndex((v) => v._id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(videoItems, oldIndex, newIndex);
      setVideoItems(reordered);
      dispatch(reorderVideos({ playlistId, oldIndex, newIndex }));
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={videoItems.map((v) => v._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videoItems.map((video) => (
              <SortableVideoCard
                key={video._id}
                id={video._id}
                video={video}
                playlistId={playlistId}
                onRemove={handleRemove}
                onVideoClick={setSelectedVideo}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
};

export default PlaylistVideoList;
