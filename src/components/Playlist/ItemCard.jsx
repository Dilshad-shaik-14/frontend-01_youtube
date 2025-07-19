import { useState } from 'react';
import { deletePlaylist } from '../../Index/api';
import toast from 'react-hot-toast';
import EditModal from './EditModal';
import { Pencil, Trash2 } from 'lucide-react';

const ItemCard = ({ playlist, refresh }) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      const res = await deletePlaylist(playlist._id);
      if (res.success) {
        toast.success('Playlist deleted');
        refresh();
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <>
      {showEdit && (
        <EditModal
          playlist={playlist}
          close={() => setShowEdit(false)}
          refresh={refresh}
        />
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-white truncate mb-1">
          {playlist.name}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2">
          {playlist.description}
        </p>

        <div className="mt-3 flex gap-4 text-sm text-blue-500 font-medium">
          <button
            onClick={() => setShowEdit(true)}
            className="hover:underline flex items-center gap-1"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="hover:underline flex items-center gap-1 text-red-500"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default ItemCard;
