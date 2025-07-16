import { useState } from 'react';
import { updatePlaylist } from '../../Index/api';
import toast from 'react-hot-toast';

const EditModal = ({ playlist, close, refresh }) => {
  const [form, setForm] = useState({
    name: playlist.name,
    description: playlist.description
  });

  const handleUpdate = async () => {
    const res = await updatePlaylist(playlist._id, form);
    if (res.success) {
      toast.success("Playlist updated");
      close();
      refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md shadow-lg border border-zinc-300 dark:border-zinc-700">
        <h2 className="text-xl font-bold mb-4">📝 Edit Playlist</h2>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 mb-3 rounded-lg border"
          placeholder="Playlist Name"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 mb-4 rounded-lg border"
          placeholder="Description"
        />
        <div className="flex justify-end gap-3">
          <button onClick={close} className="px-4 py-2 text-gray-600">Cancel</button>
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
