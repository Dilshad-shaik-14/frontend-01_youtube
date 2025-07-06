import React, { useState } from "react";
import { createTweet, publishAVideo } from "../Index/api";
import { Loader2, Video, MessageSquare, Image as ImageIcon, UploadCloud } from "lucide-react";

const Upload = () => {
  const [activeTab, setActiveTab] = useState("video");
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    file: null,
    thumbnail: null,
  });
  const [previewThumb, setPreviewThumb] = useState(null);
  const [tweetText, setTweetText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVideoChange = (e) => {
    const { name, value, files } = e.target;
    const file = files?.[0];

    if (name === "thumbnail" && file) {
      setPreviewThumb(URL.createObjectURL(file));
    }

    setVideoData((prev) => ({
      ...prev,
      [name]: file || value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (activeTab === "video") {
        
        const formData = new FormData();
        formData.append("title", videoData.title);
        formData.append("description", videoData.description);
        formData.append("videoFile", videoData.file); // 👈 FIXED HERE
        formData.append("thumbnail", videoData.thumbnail);

        await publishAVideo(formData);
        setMessage("✅ Video uploaded successfully!");
        setVideoData({ title: "", description: "", file: null, thumbnail: null });
        setPreviewThumb(null);
      } else {
        await createTweet({ text: tweetText });
        setMessage("✅ Tweet posted successfully!");
        setTweetText("");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8 rounded-2xl shadow-xl bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 transition duration-300 space-y-8 border border-zinc-200 dark:border-zinc-700">
      {/* Tabs */}
      <div className="flex bg-zinc-100 dark:bg-zinc-800 p-2 rounded-xl shadow-inner">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "video"
              ? "bg-blue-600 text-white shadow"
              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          <Video size={18} /> Video
        </button>
        <button
          onClick={() => setActiveTab("tweet")}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "tweet"
              ? "bg-blue-600 text-white shadow"
              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          <MessageSquare size={18} /> Tweet
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "video" ? (
          <>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                🎬 Video Title
              </label>
              <input
                type="text"
                name="title"
                value={videoData.title}
                onChange={handleVideoChange}
                placeholder="Enter video title"
                required
                className="w-full p-3 rounded-xl border dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                📝 Video Description
              </label>
              <textarea
                name="description"
                value={videoData.description}
                onChange={handleVideoChange}
                placeholder="Video description..."
                rows="3"
                className="w-full p-3 rounded-xl border dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                <UploadCloud size={18} /> Upload Video File
              </label>
              <input
                type="file"
                name="file"
                accept="video/*"
                onChange={handleVideoChange}
                required
                className="w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer bg-zinc-100 dark:bg-zinc-800 p-2 text-sm text-zinc-700 dark:text-zinc-300"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                <ImageIcon size={18} /> Upload Thumbnail
              </label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleVideoChange}
                required
                className="w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer bg-zinc-100 dark:bg-zinc-800 p-2 text-sm text-zinc-700 dark:text-zinc-300"
              />
              {previewThumb && (
                <img
                  src={previewThumb}
                  alt="Thumbnail Preview"
                  className="mt-2 rounded-xl shadow-md max-h-40 object-cover"
                />
              )}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              🐦 Tweet Content
            </label>
            <textarea
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              placeholder="What's on your mind?"
              rows="4"
              maxLength="280"
              required
              className="w-full p-3 rounded-xl border dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold flex items-center justify-center gap-2 transition"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading
            ? "Processing..."
            : activeTab === "video"
            ? "Upload Video"
            : "Post Tweet"}
        </button>

        {message && (
          <div className="text-sm text-center font-medium mt-2 text-green-600 dark:text-green-400">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Upload;
