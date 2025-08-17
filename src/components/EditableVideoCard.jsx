import React, { useState } from "react";
import { Pencil, Trash2, X, PlayCircle } from "lucide-react";
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

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => setEditData((prev) => ({ ...prev, thumbnail: files[0] })),
  });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: { "video/*": [] },
    maxFiles: 1,
    onDrop: (files) => setEditData((prev) => ({ ...prev, videoFile: files[0] })),
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group rounded-2xl shadow-lg overflow-hidden border border-base-200 bg-base-100 cursor-pointer transition-all duration-300"
      >
        {/* Thumbnail */}
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

        {/* Video Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate text-base-content">{video.title}</h3>
          <p className="text-sm text-zinc-500 line-clamp-2">{video.description}</p>
          <div className="text-xs text-zinc-400 mt-1">{video.views || 0} views</div>
        </div>

        {/* Editable Buttons */}
        {editable && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              className="text-blue-400 hover:text-blue-500"
              title="Edit"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
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
          <div className="bg-base-100 black:bg-black w-full max-w-lg rounded-2xl p-6 shadow-lg border border-base-200">
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
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full mb-3 p-2 rounded-md border border-base-200 black:border-black text-base-content black:text-white bg-base-100 black:bg-black"
              placeholder="Title"
            />

            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows="3"
              className="w-full mb-4 p-2 rounded-md border border-base-200 black:border-black text-base-content black:text-white bg-base-100 black:bg-black"
              placeholder="Description"
            />

            {/* Thumbnail Dropzone */}
            <div
              {...getThumbnailRootProps()}
              className="border-2 border-dashed border-base-200 black:border-black p-4 rounded-md mb-4 cursor-pointer hover:bg-base-200 black:hover:bg-black transition"
            >
              <input {...getThumbnailInputProps()} />
              <p className="text-sm text-zinc-500"> 
                {editData.thumbnail ? `Selected: ${editData.thumbnail.name}` : "Drag & drop thumbnail or click to select"}
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
              className="border-2 border-dashed border-base-200 black:border-black p-4 rounded-md mb-4 cursor-pointer hover:bg-base-200 black:hover:bg-black transition"
            >
              <input {...getVideoInputProps()} />
              <p className="text-sm text-zinc-500">
                {editData.videoFile ? `Selected: ${editData.videoFile.name}` : "Drag & drop video or click to select"}
              </p>
            </div>

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md w-full"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>

            {uploadProgress > 0 && (
              <div className="w-full bg-base-200 black:bg-black mt-3 rounded-full h-2 overflow-hidden">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-base-100 black:bg-black border border-base-200 black:border-black p-6 rounded-2xl w-full max-w-sm text-center shadow-lg">
            <h2 className="text-lg font-semibold text-base-content black:text-white mb-4">Confirm Delete</h2>
            <p className="text-sm text-zinc-500 mb-6">Are you sure you want to delete this video?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1 rounded-md border border-base-200 black:border-black text-base-content black:text-white"
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
