import React, { useState } from "react";
import { createTweet, publishAVideo } from "../Index/api";
import {
  Loader2,
  Video,
  MessageSquare,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import { useSelector } from "react-redux";

const Upload = () => {
  const { currentUser } = useSelector((state) => state.auth);
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
        formData.append("videoFile", videoData.file);
        formData.append("thumbnail", videoData.thumbnail);
        formData.append("duration", "120"); // Placeholder

        await publishAVideo(formData);
        setMessage("✅ Video uploaded successfully!");
        setVideoData({ title: "", description: "", file: null, thumbnail: null });
        setPreviewThumb(null);
      } else {
        await createTweet({ content: tweetText });
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
    <div className="max-w-xl mx-auto px-6 py-10 rounded-3xl bg-gradient-to-br from-zinc-100 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-xl border dark:border-zinc-700 space-y-10">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-4">
        {["video", "tweet"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow transition-all text-sm
              ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
              }`}
          >
            {tab === "video" ? <Video size={18} /> : <MessageSquare size={18} />}
            {tab === "video" ? "Upload Video" : "Post Tweet"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "video" ? (
          <>
            <input
              name="title"
              placeholder="🎬 Video Title"
              required
              value={videoData.title}
              onChange={handleVideoChange}
              className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              name="description"
              placeholder="📝 Description"
              rows="3"
              value={videoData.description}
              onChange={handleVideoChange}
              className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            {/* File input fields */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">
                📹 Select Video File
              </label>
              <input
                type="file"
                name="file"
                accept="video/*"
                onChange={handleVideoChange}
                required
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:text-sm
                file:font-semibold file:bg-blue-600 file:text-white
                hover:file:bg-blue-700 transition"
              />

              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">
                🖼️ Upload Thumbnail
              </label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleVideoChange}
                required
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:text-sm
                file:font-semibold file:bg-purple-600 file:text-white
                hover:file:bg-purple-700 transition"
              />

              {previewThumb && (
                <img
                  src={previewThumb}
                  alt="Thumbnail Preview"
                  className="rounded-xl mt-2 w-full max-h-48 object-cover shadow"
                />
              )}
            </div>
          </>
        ) : (
          <textarea
            placeholder="💬 What's on your mind?"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            rows="4"
            maxLength="280"
            required
            className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex justify-center items-center gap-2 shadow-md hover:opacity-90 transition-all"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Processing..." : activeTab === "video" ? "Upload Video" : "Post Tweet"}
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-2 font-medium ${
              message.startsWith("✅")
                ? "text-green-500 animate-pulse"
                : "text-red-500 animate-shake"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Upload;
