// EditableVideoCard.jsx
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { updateVideo, deleteVideo } from "../Index/api";
import VideoPlayerModal from "./VideoPlayerModal";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function EditableVideoCard({ video, onRefresh, editable }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    videoFile: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // ✅ Sync form state with incoming video
  useEffect(() => {
    if (video) {
      setEditData({
        title: video.title || "",
        description: video.description || "",
        thumbnail: null,
        videoFile: null,
      });
    }
  }, [video]);

const handleUpdate = async () => {
  try {
    setUpdating(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", editData.title.trim());
    formData.append("description", editData.description.trim());

    // ✅ Only append real File objects
    if (editData.thumbnail instanceof File) {
      formData.append("thumbnail", editData.thumbnail);
    }
    if (editData.videoFile instanceof File) {
      formData.append("videoFile", editData.videoFile);
    }

    const updatedVideo = await updateVideo(
      video._id,
      formData,
      (progressEvent) => {
        if (!progressEvent?.total) return;
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percent);
      }
    );

    toast.success("Video updated successfully 🎉");
    setEditing(false);
    setUploadProgress(0);

    onRefresh?.(updatedVideo); // ✅ return updated video to parent
  } catch (err) {
    console.error("Update failed:", err);
    toast.error("Failed to update video ❌");
  } finally {
    setUpdating(false);
  }
};


  const handleDelete = async () => {
    try {
      await deleteVideo(video._id);
      setShowConfirm(false);
      toast.success("Video deleted 🗑️");
      onRefresh?.();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete ❌");
    }
  };

  // ✅ Dropzones
  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,
      onDrop: (files) => setEditData((prev) => ({ ...prev, thumbnail: files[0] })),
    });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      accept: { "video/*": [] },
      maxFiles: 1,
      onDrop: (files) => setEditData((prev) => ({ ...prev, videoFile: files[0] })),
    });

  return (
    <>
      {/* Video Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group rounded-2xl shadow-lg overflow-hidden border border-base-200 bg-base-100 cursor-pointer transition-all duration-300"
      >
        <div
          className="aspect-video w-full relative overflow-hidden"
          onClick={() => setSelectedVideo(video)}
        >
          <img
            src={video.thumbnail || "/placeholder-thumbnail.png"}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <PlayCircle className="text-red-500" size={48} />
          </div>
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg truncate text-base-content">
            {video.title}
          </h3>
          <p className="text-sm text-zinc-500 line-clamp-2">{video.description}</p>
          <div className="text-xs text-zinc-400 mt-1">{video.views || 0} views</div>
        </div>

        {editable && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="text-blue-400 hover:text-blue-500"
              title="Edit"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
              className="text-red-400 hover:text-red-500"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      {editable && editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-base-100 w-full max-w-lg rounded-2xl p-6 shadow-lg border border-base-200 relative">
            <button
              onClick={() => setEditing(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-red-500"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-semibold text-red-500 mb-4">Edit Video</h3>

            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full mb-3 p-2 rounded-md border border-base-200 bg-base-100"
              placeholder="Title"
            />

            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows="3"
              className="w-full mb-4 p-2 rounded-md border border-base-200 bg-base-100"
              placeholder="Description"
            />

            {/* Thumbnail Dropzone */}
            <div
              {...getThumbnailRootProps()}
              className="border-2 border-dashed border-base-200 p-4 rounded-md mb-4 cursor-pointer hover:bg-base-200 transition"
            >
              <input {...getThumbnailInputProps()} />
              <p className="text-sm text-zinc-500">
                {editData.thumbnail
                  ? `Selected: ${editData.thumbnail.name}`
                  : "Drag & drop thumbnail or click to select"}
              </p>
              {editData.thumbnail && (
                <img
                  src={URL.createObjectURL(editData.thumbnail)}
                  alt="Thumbnail Preview"
                  className="mt-2 max-h-40 rounded-md object-cover"
                />
              )}
            </div>

            {/* Video Dropzone */}
            <div
              {...getVideoRootProps()}
              className="border-2 border-dashed border-base-200 p-4 rounded-md mb-4 cursor-pointer hover:bg-base-200 transition"
            >
              <input {...getVideoInputProps()} />
              <p className="text-sm text-zinc-500">
                {editData.videoFile
                  ? `Selected: ${editData.videoFile.name}`
                  : "Drag & drop video or click to select"}
              </p>
            </div>

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md w-full"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>

            {/* Progress Bar */}
            {updating && uploadProgress > 0 && (
              <div className="w-full bg-base-200 mt-3 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-600 h-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {editable && showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-base-100 p-6 rounded-2xl w-full max-w-sm text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Are you sure you want to delete this video?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1 rounded-md border border-base-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}
