import { useState } from "react";
import { createPlaylist } from "../../Index/api";
import toast from "react-hot-toast";

const CreatePlaylistModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!name) return toast.error("Playlist name is required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      const res = await createPlaylist(formData, true);
      onCreate(res.data.playlist);
      toast.success("Playlist created");
      onClose();
    } catch (err) {
      console.error("Failed to create playlist:", err);
      toast.error("Failed to create playlist");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
      <div className="bg-[rgba(24,24,24,0.8)] backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-red-700 shadow-lg text-white font-sans">
        <h2 className="text-2xl font-extrabold mb-6 text-red-500 tracking-wide">
          Create Playlist
        </h2>
        <input
          className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-red-700 focus:border-red-500 outline-none mb-4 text-white placeholder:text-gray-500 transition"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <textarea
          className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-red-700 focus:border-red-500 outline-none mb-4 text-white placeholder:text-gray-500 resize-none transition"
          placeholder="Playlist Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <input
          type="file"
          accept="image/*"
          className="mb-4 text-sm text-gray-300"
          onChange={handleFileChange}
        />
        {preview && (
          <img
            src={preview}
            alt="Cover preview"
            className="w-full h-40 object-contain rounded-xl mb-6"
          />
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
