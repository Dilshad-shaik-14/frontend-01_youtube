import React, { useState } from "react";
import { createTweet, publishAVideo } from "../Index/api";
import { Loader2, Video, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

const Upload = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("video");
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    videoFile: null,
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
        formData.append("videoFile", videoData.videoFile);
        formData.append("thumbnail", videoData.thumbnail);

        await publishAVideo(formData);
        setMessage("✅ Video uploaded successfully!");
        setVideoData({ title: "", description: "", videoFile: null, thumbnail: null });
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
    <div className="max-w-xl mx-auto px-6 py-10 rounded-3xl bg-[#181818] shadow-xl border border-[#333] space-y-10">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-4">
        {["video", "tweet"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all text-sm
              ${
                activeTab === tab
                  ? "bg-[#FF0000] text-white"
                  : "bg-[#333] text-[#F9F9F9] hover:bg-[#444]"
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
              className="w-full p-3 rounded-xl border bg-[#F9F9F9] text-black border-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
            />

            <textarea
              name="description"
              placeholder="📝 Description"
              rows="3"
              value={videoData.description}
              onChange={handleVideoChange}
              className="w-full p-3 rounded-xl border bg-[#F9F9F9] text-black border-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#ccc]">📹 Select Video File</label>
              <input
                type="file"
                name="videoFile"
                accept="video/*"
                onChange={handleVideoChange}
                required
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FF0000] file:text-white hover:file:bg-[#cc0000] transition"
              />

              <label className="block text-sm font-medium text-[#ccc]">🖼️ Upload Thumbnail</label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleVideoChange}
                required
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FF0000] file:text-white hover:file:bg-[#cc0000] transition"
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
            className="w-full p-3 rounded-xl border bg-[#F9F9F9] text-black border-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#FF0000] text-white font-semibold flex justify-center items-center gap-2 shadow-md hover:opacity-90 transition-all"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Processing..." : activeTab === "video" ? "Upload Video" : "Post Tweet"}
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-2 font-medium ${
              message.startsWith("✅") ? "text-green-500 animate-pulse" : "text-red-500 animate-shake"
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
