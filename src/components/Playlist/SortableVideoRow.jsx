import { XCircle } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableVideoRow({ video, id, playlistId, onRemove, onVideoClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-start gap-4 p-3 rounded-lg hover:bg-[#1b1b1b] border border-transparent hover:border-[#2a2a2a] transition"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
        className="absolute left-2 top-2 px-2 py-1 rounded bg-[#262626] text-zinc-300 cursor-grab active:cursor-grabbing"
      >
        ⠿
      </button>

      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => onVideoClick(video)}
        className="flex-shrink-0 w-[160px] md:w-[200px] aspect-video overflow-hidden rounded-md bg-black"
      >
        <img
          src={video?.thumbnail || "/default-thumbnail.jpg"}
          alt={video?.title || "Video thumbnail"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {video?.duration && (
          <span className="absolute right-1 bottom-1 text-[11px] md:text-xs px-1.5 py-0.5 rounded bg-black/80 text-white">
            {video.duration}
          </span>
        )}
      </button>

      {/* Video Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-1">
          <h3
            className="text-sm md:text-base font-medium text-white hover:underline cursor-pointer line-clamp-2"
            onClick={() => onVideoClick(video)}
          >
            {video?.title || "Untitled Video"}
          </h3>
          {video?.description && (
            <p className="text-xs md:text-sm text-zinc-400 line-clamp-2">
              {video.description}
            </p>
          )}
          {video?.channelName && (
            <span className="text-xs md:text-sm text-zinc-300 font-medium">
              {video.channelName}
            </span>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Remove this video from the playlist?")) {
              onRemove(video._id, playlistId);
            }
          }}
          title="Remove video"
          className="absolute right-3 top-3 p-1 rounded-full bg-[#262626] text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
        >
          <XCircle size={20} />
        </button>
      </div>
    </div>
  );
}
