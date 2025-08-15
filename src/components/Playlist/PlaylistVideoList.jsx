import React, { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import VideoPlayerModal from "../VideoPlayerModal";
import SortableVideoRow from "./SortableVideoRow";
import { removeVideoFromPlaylist } from "../../Index/api";
import toast from "react-hot-toast"; // <-- added

const PlaylistVideoList = ({ videos = [], playlistId, refresh }) => {
  const [videoItems, setVideoItems] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setVideoItems(videos.filter((v) => v && v._id));
  }, [videos]);

  const handleRemove = async (videoId) => {
    const prevItems = [...videoItems];
    const updatedItems = videoItems.filter((v) => v?._id !== videoId);
    setVideoItems(updatedItems);

    const toastId = toast.loading("Removing video..."); // <-- added

    try {
      await removeVideoFromPlaylist(videoId, playlistId); // keep your API call
      await refresh?.();
      toast.dismiss(toastId);
      toast.success("Video removed from playlist"); // <-- added
    } catch (err) {
      setVideoItems(prevItems);
      toast.dismiss(toastId);
      toast.error("Failed to remove video"); // <-- added
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
    }
  };

  if (!videoItems?.length) {
    return (
      <div className="text-zinc-400 text-sm p-6 border border-dashed border-[#2a2a2a] rounded-lg">
        This playlist doesn’t have any videos yet.
      </div>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={videoItems.map((v) => v._id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {videoItems.map((video) => (
              <SortableVideoRow
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
        <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </>
  );
};

export default PlaylistVideoList;
