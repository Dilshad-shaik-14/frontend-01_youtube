import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableVideoCard({ id, video, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow cursor-grab"
    >
      <img
        src={video.thumbnail || "/default-thumbnail.jpg"}
        alt={video.title}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold text-lg truncate">{video.title}</h3>
      <p className="text-sm text-zinc-500 line-clamp-2">{video.description}</p>
      <button
        onClick={onRemove}
        className="text-xs text-red-500 hover:underline mt-2"
      >
        Remove
      </button>
    </div>
  );
}
