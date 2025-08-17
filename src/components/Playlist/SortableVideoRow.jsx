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
      className="card bg-base-100 border border-transparent group relative flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-base-200"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
        className="absolute left-2 top-2 px-2 py-1 rounded bg-base-300 text-base-content cursor-grab active:cursor-grabbing z-20"
        aria-label="Drag handle"
      >
        ⠿
      </button>

      {/* Remove button at top-right of card */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm("Remove this video from the playlist?")) {
            onRemove(video._id, playlistId);
          }
        }}
        title="Remove video"
        aria-label="Remove video"
        className="absolute right-2 top-2 p-1 rounded-full bg-base-300 text-base-content hover:text-error z-30 shadow-sm"
      >
        <XCircle size={20} />
      </button>

      {/* Thumbnail */}
      <div
        className="flex-shrink-0 w-[160px] md:w-[200px] aspect-video overflow-hidden rounded-md bg-black cursor-pointer"
        onClick={() => onVideoClick(video)}
        aria-label={video?.title || "Open video"}
      >
        <img
          src={video?.thumbnail || "/default-thumbnail.jpg"}
          alt={video?.title || "Video thumbnail"}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Duration badge */}
        {video?.duration && (
          <span className="absolute right-2 bottom-2 text-[11px] md:text-xs px-1.5 py-0.5 rounded bg-black/80 text-white z-10">
            {video.duration}
          </span>
        )}
      </div>

      {/* Video Info beside thumbnail */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-1">
          <h3
            className="text-sm md:text-base font-medium text-base-content hover:text-error hover:underline cursor-pointer line-clamp-2 transition-colors"
            onClick={() => onVideoClick(video)}
            title={video?.title}
          >
            {video?.title || "Untitled Video"}
          </h3>
          {video?.description && (
            <p className="text-xs md:text-sm text-base-content/70 line-clamp-2">
              {video.description}
            </p>
          )}
          {video?.channelName && (
            <span className="text-xs md:text-sm text-base-content/80 font-medium">
              {video.channelName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
