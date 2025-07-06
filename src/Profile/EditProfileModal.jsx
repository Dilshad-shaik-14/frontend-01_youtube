import React, { useState } from "react";
import axios from "axios";

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [coverImage, setCoverImage] = useState(user.coverImage || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`/users/${user._id}`, {
        fullName,
        avatar,
        coverImage,
      });
      onUpdate(res.data); 
      onClose();
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <label className="block text-sm mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 rounded border mb-3 bg-zinc-100 dark:bg-zinc-800"
        />

        <label className="block text-sm mb-1">Avatar URL</label>
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="w-full p-2 rounded border mb-3 bg-zinc-100 dark:bg-zinc-800"
        />

        <label className="block text-sm mb-1">Cover Image URL</label>
        <input
          type="text"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full p-2 rounded border mb-4 bg-zinc-100 dark:bg-zinc-800"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-300 dark:bg-zinc-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
