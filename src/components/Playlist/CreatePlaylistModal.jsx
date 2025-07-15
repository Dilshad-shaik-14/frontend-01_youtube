import { useState } from "react";
import { createPlaylist } from "../../Index/api"; // Your API call
import toast from "react-hot-toast";

const CreatePlaylistModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name) return toast.error("Playlist name is required");
    try {
      const res = await createPlaylist({ name, description });
      onCreate(res.data.playlist); // call parent refresh
      toast.success("Playlist created");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create playlist");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-xl border dark:border-zinc-700">
        <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">Create Playlist</h2>
        <input
          className="w-full px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white mb-3"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="w-full px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
          placeholder="Playlist Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="text-zinc-500 hover:underline">Cancel</button>
          <button onClick={handleCreate} className="bg-red-600 text-white px-4 py-2 rounded">Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
