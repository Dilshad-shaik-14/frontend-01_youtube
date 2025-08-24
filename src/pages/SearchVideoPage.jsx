import React, { useState, useEffect } from "react";
import { getVideoByTitle } from "../Index/api";
import { Loader } from "../layout/SkeletonCard";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import VideoPlayerModal from "../components/VideoPlayerModal";
import { ThumbsUp, MessageCircle, Eye } from "lucide-react";

const SearchVideoPage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const title = searchParams.get("title");
    if (title) {
      setQuery(title);
      searchVideo(title);
    }
  }, [searchParams]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter a video title");
      return;
    }
    searchVideo(query.trim());
  };

  const searchVideo = async (title) => {
    setLoading(true);
    setVideos([]);

    try {
      const res = await getVideoByTitle(title);
      setVideos(res.data || []);
    } catch (err) {
      toast.error("No video found with that title");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-base-100 p-8">
      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-3xl flex items-center gap-4 mb-10"
      >
        <input
          type="text"
          placeholder="Search video by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input input-bordered w-full rounded-full px-5 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          className="btn btn-error rounded-full px-6 py-3"
          disabled={loading}
        >
          Search
        </button>
      </form>

      {/* Loader */}
      {loading && <Loader />}

      {/* Videos grid */}
      {videos.length > 0 ? (
        <div
          className={`flex-1 w-full flex justify-center ${
            videos.length === 1 ? "items-center min-h-[60vh]" : "items-start"
          }`}
        >
          <div
            className={`grid gap-10 justify-items-center w-full max-w-7xl ${
              videos.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {videos.map((video) => (
              <div
                key={video._id}
                className="w-[600px] rounded-2xl overflow-hidden bg-base-100 shadow-lg transition-transform duration-200 ease-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <figure className="w-full h-96 overflow-hidden">
                  <img
                    src={video.thumbnail || "/default-thumbnail.jpg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </figure>

                {/* Body */}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-base-content truncate">
                    {video.title}
                  </h2>

                  {video.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {video.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-base-200/60 text-base-content/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-base-content/70 mb-4 max-h-20 overflow-hidden">
                    {video.description || "No description"}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={video.owner?.avatar || "/default-avatar.png"}
                      alt={video.owner?.userName}
                      className="w-12 h-12 rounded-full border"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {video.owner?.fullName || video.owner?.userName}
                      </span>
                      <span className="text-xs text-base-content/60">
                        @{video.owner?.userName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-base-content/70 border-t pt-4">
                    <div className="flex items-center gap-2">
                      <ThumbsUp size={18} className="text-base-content/80" />
                      <span>{video.totalLikes || 0}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageCircle size={18} className="text-base-content/80" />
                      <span>{video.totalComments || 0}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye size={18} className="text-base-content/80" />
                      <span>{video.views || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !loading && (
          <p className="mt-10 text-base-content/60 text-center w-full">
            No videos found
          </p>
        )
      )}

      {/* Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default SearchVideoPage;
