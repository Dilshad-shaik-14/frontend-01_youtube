import { useState } from 'react';
import { deletePlaylist } from '../../Index/api';
import toast from 'react-hot-toast';
import EditModal from './EditModal';

const ItemCard = ({ playlist, refresh }) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      const res = await deletePlaylist(playlist._id);
      if (res.success) {
        toast.success('Deleted');
        refresh();
      } else toast.error(res.message);
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
      <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-5">
        <h3 className="text-xl font-bold">{playlist.name}</h3>
        <p className="text-gray-600">{playlist.description}</p>
        <div className="mt-4 flex gap-3">
          <button onClick={() => setShowEdit(true)} className="text-blue-600">Edit</button>
          <button onClick={handleDelete} className="text-red-600">Delete</button>
        </div>
      </div>
    </>
  );
};

export default ItemCard;
