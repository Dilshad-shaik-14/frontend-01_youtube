import { removeVideoFromPlaylist } from "../../services/playlistAPI";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";

const PlaylistVideoList = ({ videos = [], playlistId, refresh }) => {
  const handleRemove = async (videoId) => {
    try {
      await removeVideoFromPlaylist(videoId, playlistId);
      toast.success("Video removed");
      refresh();
    } catch (err) {
      console.error("Error removing video:", err);
      toast.error("Failed to remove video");
    }
  };

  if (!videos || videos.length === 0) {
    return <p className="text-zinc-400 mt-2">No videos in this playlist.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div
          key={video._id}
          className="bg-zinc-800 p-3 rounded-lg relative overflow-hidden group transition hover:shadow-lg"
        >
          <img
            src={video.thumbnail || "/default-thumbnail.jpg"}
            alt={video.title}
            className="w-full h-32 object-cover rounded mb-2"
          />
          <h3 className="text-white text-sm font-semibold truncate">
            {video.title}
          </h3>

          {/* Delete Icon on Hover */}
          <button
            onClick={() => handleRemove(video._id)}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            title="Remove from playlist"
          >
            <XCircle size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlaylistVideoList;
