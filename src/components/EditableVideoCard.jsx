import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  X,
  PlayCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { updateVideo, deleteVideo } from "../Index/api";
import VideoPlayerModal from "./VideoPlayerModal";
import { useDropzone } from "react-dropzone";

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function EditableVideoCard({ video, onRefresh, editable }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: video.title,
    description: video.description,
    thumbnail: null,
    videoFile: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("description", editData.description);
      if (editData.thumbnail) formData.append("thumbnail", editData.thumbnail);
      if (editData.videoFile) formData.append("videoFile", editData.videoFile);

      await updateVideo(video._id, formData, (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percent);
      });

      setEditing(false);
      onRefresh?.();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(false);
      setUploadProgress(0);
    }
    
  };

  const handleDelete = async () => {
    await deleteVideo(video._id);
    setShowConfirm(false);
    onRefresh?.();
  };

  // Dropzone for Thumbnail
  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      setEditData((prev) => ({ ...prev, thumbnail: files[0] }));
    },
  });

  // Dropzone for Video
  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
  } = useDropzone({
    accept: { "video/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      setEditData((prev) => ({ ...prev, videoFile: files[0] }));
    },
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group rounded-xl shadow bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
      >
        <div
          className="aspect-video relative w-full overflow-hidden"
          onClick={() => setSelectedVideo(video)}
        >
          <img
            src={video.thumbnail || "/placeholder-thumbnail.png"}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <PlayCircle className="text-white" size={48} />
          </div>
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-lg truncate">
            {video.title}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2">
            {video.description}
          </p>
          <div className="text-xs text-zinc-500">{video.views || 0} views</div>
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 w-full max-w-lg rounded-xl p-6 relative">
            <button
              onClick={() => setEditing(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-red-500"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-semibold text-red-500 mb-4">
              Edit Video
            </h3>

            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-zinc-800 text-white border border-zinc-600"
              placeholder="Title"
            />

            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              rows="3"
              className="w-full mb-4 p-2 rounded bg-zinc-800 text-white border border-zinc-600"
              placeholder="Description"
            />

            {/* Thumbnail Dropzone */}
            <div
              {...getThumbnailRootProps()}
              className="border-2 border-dashed border-zinc-600 p-4 rounded mb-4 cursor-pointer hover:bg-zinc-800 transition"
            >
              <input {...getThumbnailInputProps()} />
              <p className="text-sm text-zinc-400">
                {editData.thumbnail
                  ? `Selected: ${editData.thumbnail.name}`
                  : "Drag & drop thumbnail or click to select"}
              </p>
              {editData.thumbnail && (
                <img
                  src={URL.createObjectURL(editData.thumbnail)}
                  alt="Thumbnail Preview"
                  className="mt-2 max-h-40 rounded object-cover"
                />
              )}
            </div>

            {/* Video Dropzone */}
            <div
              {...getVideoRootProps()}
              className="border-2 border-dashed border-zinc-600 p-4 rounded mb-4 cursor-pointer hover:bg-zinc-800 transition"
            >
              <input {...getVideoInputProps()} />
              <p className="text-sm text-zinc-400">
                {editData.videoFile
                  ? `Selected: ${editData.videoFile.name}`
                  : "Drag & drop video or click to select"}
              </p>
            </div>

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded w-full"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>

            {uploadProgress > 0 && (
              <div className="w-full bg-zinc-800 mt-3 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {editable && showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 p-6 rounded-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to delete this video?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1 rounded border dark:border-zinc-600 text-zinc-600 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}
