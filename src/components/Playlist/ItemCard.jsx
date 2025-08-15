import { useState } from "react";
import { deletePlaylist } from "../../Index/api";
import toast from "react-hot-toast";
import EditModal from "./EditModal";
import { Pencil, Trash2 } from "lucide-react";

const ItemCard = ({ playlist, refresh, onClick }) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure?")) {
      const res = await deletePlaylist(playlist._id);
      if (res.success) {
        toast.success("Playlist deleted");
        refresh?.();
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

<div className="group relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#121212] hover:bg-[#171717] transition-colors">
  {/* Cover */}
  <button
    type="button"
    onClick={onClick}
    className="block w-full relative aspect-video overflow-hidden"
    aria-label={`Open ${playlist.name}`}
  >
    {playlist.coverImage ? (
      <img
        src={playlist.coverImage}
        alt={`${playlist.name} cover`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
    ) : (
      <div className="h-full w-full grid place-items-center bg-zinc-900 text-zinc-500">
        No Cover Image
      </div>
    )}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
  </button>

  {/* Meta + actions */}
  <div className="p-4 flex flex-col gap-3">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h3 className="text-base sm:text-lg font-semibold line-clamp-1">
        {playlist.name}
      </h3>
      {playlist.user && (
        <span className="text-sm text-zinc-500">
          by {playlist.user.name}
        </span>
      )}
    </div>

    {playlist.description && (
      <p className="text-sm text-zinc-400 line-clamp-2">{playlist.description}</p>
    )}

    <div className="flex items-center gap-4 text-sm mt-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowEdit(true);
        }}
        className="inline-flex items-center gap-2 text-zinc-300 hover:text-white"
      >
        <Pencil size={16} /> Edit
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white"
      >
        <Trash2 size={16} /> Delete
      </button>
    </div>
  </div>
</div>

    </>
  );
};

export default ItemCard;
