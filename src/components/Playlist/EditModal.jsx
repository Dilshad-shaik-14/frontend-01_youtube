import { useState } from "react";
import { updatePlaylist } from "../../Index/api";
import toast from "react-hot-toast";

export default function EditModal({ playlist, close, refresh }) {
  const [name, setName] = useState(playlist?.name || "");
  const [description, setDescription] = useState(playlist?.description || "");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(playlist?.coverImage || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (coverImage) formData.append("coverImage", coverImage);

    const res = await updatePlaylist(playlist._id, formData);
    if (res.success) {
      toast.success("Playlist updated");
      close();
      refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
      {/* Animated Glassmorphic Modal */}
      <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-2xl w-full max-w-lg p-6 transform transition-all duration-300 scale-95 opacity-0 animate-modalFade">
        {/* Header */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          ✏️ Edit Playlist
        </h2>

        {/* Name Input */}
        <label className="block mb-3">
          <span className="block text-sm font-medium text-gray-800 dark:text-gray-300">
            Playlist Name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/30 dark:border-gray-600 bg-white/30 dark:bg-gray-800/30 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </label>

        {/* Description Input */}
        <label className="block mb-3">
          <span className="block text-sm font-medium text-gray-800 dark:text-gray-300">
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/30 dark:border-gray-600 bg-white/30 dark:bg-gray-800/30 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
          ></textarea>
        </label>

        {/* Cover Image Upload */}
        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-800 dark:text-gray-300">
            Cover Image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-3 file:rounded-lg file:border file:border-white/30 file:bg-white/40 dark:file:bg-gray-800/40 file:px-4 file:py-2 file:text-gray-900 dark:file:text-white hover:file:bg-white/50 dark:hover:file:bg-gray-700/50 cursor-pointer"
          />
          {preview && (
            <img
              src={preview}
              alt="Cover Preview"
              className="mt-3 h-40 w-full object-cover rounded-lg border border-white/30 dark:border-gray-700"
            />
          )}
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={close}
            className="px-4 py-2 rounded-lg bg-gray-200/60 dark:bg-gray-700/60 text-gray-900 dark:text-white hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition"
          >
            Update
          </button>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes modalFade {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-modalFade {
          animation: modalFade 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

