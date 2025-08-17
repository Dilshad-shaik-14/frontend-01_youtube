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
      <div className="card bg-base-100 dark:bg-base-200 rounded-2xl p-8 w-full max-w-md border border-red-700 shadow-lg text-base-content font-sans">
        {/* Heading */}
        <h2 className="text-2xl font-extrabold mb-6 text-red-500 tracking-wide border-b-2 border-red-500 pb-2 w-fit">
          Create Playlist
        </h2>

        {/* Playlist Name */}
        <input
          className="input input-bordered w-full mb-4 bg-base-200 dark:bg-base-300 text-base-content placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        {/* Playlist Description */}
        <textarea
          className="textarea textarea-bordered w-full mb-4 bg-base-200 dark:bg-base-300 text-base-content placeholder:text-zinc-500 dark:placeholder:text-zinc-400 resize-none"
          placeholder="Playlist Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        {/* Cover Image */}
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full mb-4 text-base-content"
          onChange={handleFileChange}
        />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="Cover preview"
            className="w-full h-40 object-contain rounded-xl mb-6"
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="btn btn-error"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
