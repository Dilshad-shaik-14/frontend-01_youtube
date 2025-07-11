import React, { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { updateVideo } from "../Index/api"; // ✅ your API

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function VideoCard({ video, onClick, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);

  if (!video) return null;

  const { _id, title, description, thumbnail, views, duration, owner } = video;

  const handleEdit = () => {
    setEditData({
      title,
      description,
      newThumbnail: null,
      newVideo: null,
    });
    setEditing(true);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("description", editData.description);
      if (editData.newThumbnail) formData.append("thumbnail", editData.newThumbnail);
      if (editData.newVideo) formData.append("video", editData.newVideo);

      await updateVideo(_id, formData);
      setEditing(false);
      window.location.reload(); // or trigger re-fetch
    } catch (err) {
      console.error("Failed to update video:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {/* Card */}
      <motion.div
        className="group relative rounded-2xl overflow-hidden shadow-lg bg-zinc-900 border border-zinc-800 cursor-pointer transition-all"
        whileHover={{ scale: 1.02 }}
        onClick={() => onClick?.(video)}
      >
        {/* Thumbnail */}
        <div className="aspect-video relative w-full overflow-hidden">
          <img
            src={thumbnail || "/placeholder-thumbnail.png"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:opacity-100 opacity-0 transition duration-300" />
          {/* Duration */}
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Info */}
        <div className="p-4 space-y-1">
          <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
          <p className="text-sm text-zinc-400 line-clamp-2">{description}</p>
          <div className="text-xs text-zinc-500">{views || 0} views</div>
        </div>

        {/* Edit/Delete Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            className="text-blue-400 hover:text-blue-500"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(_id);
            }}
            className="text-red-400 hover:text-red-500"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl p-6 relative">
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
              className="w-full mb-3 p-2 rounded bg-zinc-800 text-white border border-zinc-600"
              placeholder="Title"
            />

            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows="3"
              className="w-full mb-4 p-2 rounded bg-zinc-800 text-white border border-zinc-600"
              placeholder="Description"
            />

            <label className="block mb-2 text-sm text-white">Change Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditData({ ...editData, newThumbnail: e.target.files[0] })
              }
              className="mb-4 file:bg-red-500 file:text-white file:px-3 file:py-1 file:rounded"
            />

            <label className="block mb-2 text-sm text-white">Change Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setEditData({ ...editData, newVideo: e.target.files[0] })
              }
              className="mb-4 file:bg-red-500 file:text-white file:px-3 file:py-1 file:rounded"
            />

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded w-full"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
